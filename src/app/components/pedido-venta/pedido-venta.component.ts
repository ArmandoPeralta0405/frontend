import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environment.prod';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MonedaService } from "../moneda-list/moneda.service";
import { Moneda } from "../../models/moneda.model";
import { ListaPrecioService } from "../lista-precio-list/lista-precio.service";
import { ListaPrecio } from "../../models/lista_precio.model";
import { ArticuloService } from "../articulo-list/articulo.service";
import { Articulo } from "../../models/articulo.model";
import { PedidoVentaService } from './pedido-venta.service'; // Importa el servicio aquí
import { FocusService } from "../../global/focus.service";
import { filter } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-pedido-venta',
  templateUrl: './pedido-venta.component.html',
  styleUrls: ['./pedido-venta.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class PedidoVentaComponent implements OnInit {

  @ViewChild('observacionInput') observacionInput: ElementRef | any;
  @ViewChild('cantidadInput') cantidadInput: ElementRef | any;

  sugerencias: string[] = [];

  numeroPedidoDisponible: number | undefined;

  codigoAlfanumerico: string = '';

  formularioCabecera: FormGroup | any; // Declarar el FormGroup para la cabecera
  formularioArticulo: FormGroup | any;  // Declarar el FormGroup para el artículo
  formularioDetalle: FormGroup | any;

  monedas: Moneda[] = [];
  selectedMonedaId: any;

  listas_precios: ListaPrecio[] = [];
  selectedListaPrecioId: any;

  articulos: Articulo[] = [];
  selectedArticuloId: any;

  pedidoDetalles: any[] = [];

  articulosBD: Articulo[] = [];

  // Variable para controlar el estado de los campos
  camposHabilitados = false;

  constructor(
    private monedaService: MonedaService,
    private listaPrecioService: ListaPrecioService,
    private articuloService: ArticuloService,
    private pedidoVentaService: PedidoVentaService,
    private formBuilder: FormBuilder,
    private focusService: FocusService
  ) { }

  formularios() {
    // Inicializa los formGroups y sus controles
    this.formularioCabecera = this.formBuilder.group({
      numero_pedido: [''],
      moneda_id: [''],
      lista_precio_id: [''],
      observacion: ['']
    });

    this.formularioArticulo = this.formBuilder.group({
      codigo_alfanumerico: [''],
      descripcion_articulo: [''],
      precio: [''],
      cantidad: [''],
      articulo_id: ['']
    });

    this.formularioDetalle = this.formBuilder.group({});
  }

  ngOnInit() {
    // Llamada a la función para inicializar los formularios
    this.formularios();

    // Llamada a las funciones para cargar datos
    this.loadMonedas();
    this.loadListasPrecios();

    // Deshabilita los formularios
    this.formularioCabecera.disable();
    this.formularioArticulo.disable();
    this.formularioDetalle.disable();

  }

  // Función para cargar los articulos
  loadArticulos() {
    //Primero limpiamos el arreglo
    this.articulosBD = [];
    //Ahora cargamos los datos
    // Asigna los artículos a articulosBD después de cargarlos
    this.articuloService.getArticulos().subscribe(
      (response: Articulo[]) => {
        this.articulosBD = response;
        console.log(this.articulosBD)
      },
      (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    );
  }

  // Función para cargar las monedas
  loadMonedas() {
    //Primero limpiamos el arreglo
    this.monedas = [];
    //Ahora cargamos los datos
    this.monedaService.getMonedas().subscribe(
      (response: any[]) => {
        this.monedas = response;
      },
      (error) => {
        console.error('Error al cargar las monedas:', error);
      }
    );
  }

  // Función para cargar las listas de precios
  loadListasPrecios() {
    //Primero limpiamos el arreglo
    this.listas_precios = [];
    //Ahora cargamos los datos
    this.listaPrecioService.getListasPrecios().subscribe(
      (response: any[]) => {
        this.listas_precios = response;
      },
      (error) => {
        console.error('Error al cargar las listas de precios:', error);
      }
    );
  }

  searchArticulo() {
    if ((this.formularioArticulo.get('codigo_alfanumerico').value).trim() != "") {
      const filtros = {
        filtros: this.formularioArticulo.get('codigo_alfanumerico').value
        // Otros filtros si los tienes
      };
      const filtrosPrecio = {
        articulo_id: 0,
        lista_precio_id: 0
      }

      // Llama al servicio de Articulo para buscar artículos
      this.articuloService.searchArticulo({ filtros }).pipe(
        // Filtra solo los artículos con estado igual a 1 (activo)
        filter(response => response.estado === 1)
      ).subscribe(
        (response: any) => {
          this.formularioArticulo.get('descripcion_articulo').setValue(response.descripcion);
          //Se obtiene los parametros necesarios para obtener el precio
          filtrosPrecio.articulo_id = response.articulo_id;
          filtrosPrecio.lista_precio_id = this.formularioCabecera.get('lista_precio_id').value;
          //Se realiza la peticion para obtener el precio
          this.pedidoVentaService.getObtenerPrecio({ filtrosPrecio }).subscribe(
            (response: any) => {
              this.formularioArticulo.get('articulo_id').setValue(filtrosPrecio.articulo_id);
              this.formularioArticulo.get('precio').setValue(response.precio);
              // Obtén el valor seleccionado del campo moneda_id
              this.selectedMonedaId = this.formularioCabecera.get('moneda_id').value;
              this.goToNextField("txtCantidad");
            });
        },
        (error) => {
          console.error('Error al buscar artículo:', error);
          this.showErrorAlert('Ocurrió un error: ' + error.error.message);
        }
      );
    }
  }

  searchArticuloDescripcion() {
    const descripcion = this.formularioArticulo.get('descripcion_articulo').value.trim().toLowerCase();

    // Filtra los artículos que coincidan con la descripción escrita
    this.sugerencias = this.articulosBD.filter(articulo =>
      articulo.descripcion.toLowerCase().includes(descripcion)
    ).map(articulo => articulo.descripcion);
  }

  seleccionarSugerencia(sugerencia: string) {
    // Cuando el usuario selecciona una sugerencia, llenar el campo con la sugerencia
    this.formularioArticulo.get('descripcion_articulo').setValue(sugerencia);

    // Busca el artículo correspondiente en articulosBD por su descripción
    const articuloSeleccionado = this.articulosBD.find(articulo =>
      articulo.descripcion.toLowerCase() === sugerencia.toLowerCase()
    );

    if (articuloSeleccionado) {
      // Si se encuentra el artículo, asigna su código alfanumérico o ID al campo codigo_alfanumerico
      this.formularioArticulo.get('codigo_alfanumerico').setValue(articuloSeleccionado.codigo_alfanumerico);

      // Ejecuta la función searchArticulo para buscar el artículo por código alfanumérico
      this.searchArticulo();
    }

    // Luego, oculta las sugerencias
    this.sugerencias = [];
  }

  nuevoPedido(estado: boolean) {
    // Habilita los campos, excepto numero_pedido
    this.habilitarCampos(estado);
    this.formularioCabecera.get('numero_pedido')?.disable();

    // Selecciona el primer registro de Moneda si hay al menos uno
    if (this.monedas.length > 0) {
      this.formularioCabecera.get('moneda_id')?.setValue(this.monedas[0].moneda_id);
    }

    // Selecciona el primer registro de Lista de Precio si hay al menos uno
    if (this.listas_precios.length > 0) {
      this.formularioCabecera.get('lista_precio_id')?.setValue(this.listas_precios[0].lista_precio_id);
    }

    // Llama al servicio para obtener el número de pedido disponible sin enviar ningún ID
    this.pedidoVentaService.getNumeroPedidoDisponible()
      .subscribe(response => {
        const numeroPedido = response.toString().padStart(3, '0'); // Agrega ceros a la izquierda
        // Asigna el número retornado al campo numero_pedido del formulario
        this.formularioCabecera.get('numero_pedido').setValue(numeroPedido);

        // Enfoca el campo de observación
        this.observacionInput.nativeElement.focus();
      });
  }

  agregarArticuloDetalle() {
    // Obtén los valores del formularioArticulo
    const codigoAlfanumerico = this.formularioArticulo.get('codigo_alfanumerico').value;
    const descripcionArticulo = this.formularioArticulo.get('descripcion_articulo').value;
    const precioInputValue = this.formularioArticulo.get('precio').value;
    const precio = parseFloat(precioInputValue); // Convertir a número
    let cantidad = this.formularioArticulo.get('cantidad').value;
    const art_id = this.formularioArticulo.get('articulo_id').value;
    console.log(cantidad);

    // Verifica si cantidad está vacío, es cero o es nulo
    if (cantidad === '' || cantidad === 0 || cantidad === null) {
      cantidad = 1; // Asigna 1 si se cumple alguna de estas condiciones
    }

    // Verifica que precio sea un número antes de formatearlo
    if (!isNaN(precio)) {
      // Aplica el formato deseado al precio antes de agregarlo
      const precioFormateado = precio.toFixed(3); // Ajusta el número de decimales según tus necesidades

      // Busca si ya existe un artículo con el mismo códigoAlfanumerico
      const articuloExistente = this.pedidoDetalles.find(item => item.art_id === art_id);

      if (articuloExistente) {
        // Si el artículo existe, actualiza la cantidad y recalcula el subtotal
        articuloExistente.cantidad += cantidad;
        articuloExistente.subtotal = (parseFloat(articuloExistente.precio) * articuloExistente.cantidad).toFixed(3);
      } else {
        // Si el artículo no existe, crea un nuevo detalleArticulo
        const subtotal = (precio * cantidad).toFixed(3);

        const detalleArticulo = {
          codigoAlfanumerico,
          descripcionArticulo,
          precio: precioFormateado,
          cantidad,
          subtotal,
          art_id
        };
        // Agrega el detalleArticulo al arreglo pedidoDetalles
        this.pedidoDetalles.push(detalleArticulo);
      }
      // Limpia el formulario o realiza otras acciones según tus necesidades
      this.formularioArticulo.reset();
      this.goToNextField('txtCodigoAlfanumerico');
    } else {
      // Aquí puedes manejar el caso en el que precio no sea un número
      console.error('El precio no es un número válido.');
    }
  }

  retirarArticuloDetalle(item: any) {
    // Encuentra el índice del artículo en el arreglo
    const index = this.pedidoDetalles.findIndex(detalle => detalle.art_id === item.art_id);
    if (index !== -1) {
      // Si se encuentra, elimina el artículo
      this.pedidoDetalles.splice(index, 1);
      // Recalcula el orden de los elementos restantes
      this.recalcularOrden();
    }
  }

  recalcularOrden() {
    // Recalcula el número de orden en función de la posición en el arreglo
    this.pedidoDetalles.forEach((detalle, index) => {
      detalle.orden = index + 1;
    });
  }

  formatearValor(valor: any, monedaId: number): string {
    // Convierte el valor a un número si es una cadena
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (!isNaN(valorNumerico) && typeof monedaId !== 'undefined') {
      if (monedaId === 1) {
        // Moneda 1: Sin decimales y con separador de miles
        return valorNumerico.toLocaleString('es-ES', { minimumFractionDigits: 0, useGrouping: true });
      } else {
        // Otras monedas: 3 decimales y con separador de miles
        return valorNumerico.toLocaleString('es-ES', { minimumFractionDigits: 3, useGrouping: true });
      }
    } else {
      // Manejar el caso en el que valor no sea válido o monedaId sea undefined
      return 'Valor no válido';
    }
  }

  cancelarPedido(estado: boolean) {
    // Se deshabilitan los campos
    this.habilitarCampos(estado);

    // Selecciona el valor "Seleccione" en Moneda
    this.formularioCabecera.get('moneda_id')?.setValue(null);

    // Selecciona el valor "Seleccione" en Lista de Precio
    this.formularioCabecera.get('lista_precio_id')?.setValue(null)
    this.limpiarCampos();
  }

  habilitarCampos(estado: boolean) {
    // Cambia el estado de los campos a habilitados
    this.camposHabilitados = estado;

    // Habilita o deshabilita los formularios según el estado
    if (estado) {
      this.formularioCabecera.enable();
      this.formularioArticulo.enable();
      this.formularioDetalle.enable();
    } else {
      this.formularioCabecera.disable();
      this.formularioArticulo.disable();
      this.formularioDetalle.disable();
    }
  }

  limpiarCampos() {
    this.formularioCabecera.reset();
    this.formularioArticulo.reset();
    this.formularioDetalle.reset();
    this.pedidoDetalles = [];
  }

  goToNextField(inputId: string) {
    this.focusService.focusNext(inputId);
  }

  getMascara(monedaId: number): string {
    // Si monedaId es igual a 1, usar máscara sin decimales
    if (monedaId === 1) {
      return 'separator.0';
    } else {
      // De lo contrario, usar máscara con 3 decimales
      return 'separator.3';
    }
  }

  showErrorAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: message
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }

  showSuccesAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Éxito',
      subtitle: '',
      body: message
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }

}
