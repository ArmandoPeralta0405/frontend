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
import { FocusService } from "../../global/focus.service";
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PedidoVentaService } from './pedido-venta.service';
import { PedidoVenta } from "../../models/pedido_venta.model";
import { PedidoVentaDetalle } from "../../models/pedido_venta_detalle.model";
import { Router } from '@angular/router';

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

  modalOptions: NgbModalOptions = {
    backdrop: 'static', // Esto evita que se cierre haciendo clic fuera del modal
    keyboard: false,    // Esto evita que se cierre presionando la tecla "Esc"
  };

  pedido_venta_id_recuperado :number = 0;

  item_numero: number = 0;

  sugerencias: string[] = [];

  numeroPedidoDisponible: number | undefined;

  codigoAlfanumerico: string = '';

  formularioCabecera: FormGroup | any; // Declarar el FormGroup para la cabecera
  formularioArticulo: FormGroup | any;  // Declarar el FormGroup para el artículo
  formularioDetalle: FormGroup | any;
  botonesForm: FormGroup | any;

  monedas: Moneda[] = [];
  selectedMonedaId: any;
  selectedMonedaABreviacion: any;

  listas_precios: ListaPrecio[] = [];
  pedidoVentaData: any;

  articulos: Articulo[] = [];
  selectedArticuloId: any;

  pedidoDetalles: any[] = [];

  articulosBD: Articulo[] = [];

  totalArticulos: number = 0;
  totalMonto: number = 0;

  // Variable para controlar el estado de los campos
  camposHabilitados = false;

  constructor(
    private monedaService: MonedaService,
    private listaPrecioService: ListaPrecioService,
    private articuloService: ArticuloService,
    private pedidoVentaService: PedidoVentaService,
    private formBuilder: FormBuilder,
    private focusService: FocusService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    // Inicializa el FormGroup para los botones
    this.botonesForm = this.formBuilder.group({
      nuevoHabilitado: [false],      // Habilita el botón "Nuevo" por defecto
      guardarHabilitado: [true],  // Deshabilita el botón "Guardar" por defecto
      cancelarHabilitado: [true], // Deshabilita el botón "Cancelar" por defecto
    });
  }

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
    if ((this.formularioArticulo.get('codigo_alfanumerico').value).trim() !== "") {
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
          // Se obtienen los parámetros necesarios para obtener el precio
          filtrosPrecio.articulo_id = response.articulo_id;
          filtrosPrecio.lista_precio_id = this.formularioCabecera.get('lista_precio_id').value;
          // Se realiza la petición para obtener el precio
          this.pedidoVentaService.getObtenerPrecio({ filtrosPrecio }).subscribe(
            (response: any) => {
              // Verifica si el precio es 0, nulo o una cadena vacía
              if (response.precio === 0 || response.precio === null || response.precio === '' || parseFloat(response.precio) === 0) {
                // Mostrar una alerta si el precio es igual a 0, nulo, una cadena vacía o 0 en formato decimal
                this.showErrorAlert('El precio es 0 o no está definido. Debe asignar un precio válido para poder utilizarlo.');
              } else {
                this.formularioArticulo.get('articulo_id').setValue(filtrosPrecio.articulo_id);
                this.formularioArticulo.get('precio').setValue(response.precio);
                // Obtén el valor seleccionado del campo moneda_id
                this.selectedMonedaId = this.formularioCabecera.get('moneda_id').value;
                this.goToNextField("txtCantidad");
              }
            });
        },
        (error) => {
          console.error('Alerta: ', error);
          this.showErrorAlert(error.error.message);
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
    //Se habilita o deshabilita los botones
    this.botonesForm.get('nuevoHabilitado')?.setValue(true);
    this.botonesForm.get('guardarHabilitado')?.setValue(false);
    this.botonesForm.get('cancelarHabilitado')?.setValue(false);
    // Habilita los campos, excepto numero_pedido
    this.habilitarCampos(estado);
    this.formularioCabecera.get('numero_pedido')?.disable();
    this.formularioArticulo.get('precio')?.disable();

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
    const referencia = codigoAlfanumerico;

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

        this.item_numero = this.recalcularOrden();


        const detalleArticulo = {
          item_numero: this.item_numero,
          codigoAlfanumerico,
          descripcionArticulo,
          precio: precioFormateado,
          cantidad,
          subtotal,
          art_id,
          referencia
        };
        // Agrega el detalleArticulo al arreglo pedidoDetalles
        this.pedidoDetalles.push(detalleArticulo);
      }
      // Limpia el formulario o realiza otras acciones según tus necesidades
      this.formularioArticulo.reset();
      this.calcularTotalArticulos();
      this.calcularTotalMonto();
      this.recalcularOrden();
      this.goToNextField('txtCodigoAlfanumerico');
    } else {
      // Aquí puedes manejar el caso en el que precio no sea un número
      console.error('El precio no es un número válido.');
    }
  }

  retirarArticuloDetalle(item: any) {
    // Encuentra el índice del artículo en el arreglo
    const index = this.pedidoDetalles.findIndex(detalle => detalle.item_numero === item.item_numero);
    if (index !== -1) {
      // Si se encuentra, elimina el artículo
      this.pedidoDetalles.splice(index, 1);
      // Recalcula el orden de los elementos restantes
      this.recalcularOrden();
      this.calcularTotalArticulos();
      this.calcularTotalMonto();
    }
  }

  guardarPedido() {

    let modalAbierto = false;

    // Aquí se preparará el JSON y se enviará a la API para que lo procese
    // Datos de la cabecera
    const monedaID = this.formularioCabecera.get('moneda_id').value;
    const lista_precioID = this.formularioCabecera.get('lista_precio_id').value;
    const numeroPedido = this.formularioCabecera.get('numero_pedido').value;
    const observacion = this.formularioCabecera.get('observacion').value;
    const usuario = this.authService.getUsuarioFromToken();
    let usuarioID;
    if (usuario) {
      usuarioID = usuario.user_id;
    } else {
      // Manejar el caso en el que no se pueda obtener el usuario desde el token
      console.error('No se pudo obtener el usuario desde el token');
    }
    const pedidoVentaCabecera: PedidoVenta = {
      moneda_id: monedaID,
      lista_precio_id: lista_precioID,
      numero_pedido: numeroPedido,
      observacion: observacion,
      usuario_id: usuarioID,
    };
    // Datos del detalle
    const pedidoVentaDetalle: PedidoVentaDetalle[] = [];

    // Recorre el array de pedidosDetalles[]
    for (const detalle of this.pedidoDetalles) {
      // Crea un objeto que represente un detalle del pedido
      const detallePedido: PedidoVentaDetalle = {
        item_numero: detalle.item_numero, // Asegúrate de que este campo sea correcto
        articulo_id: detalle.art_id, // Asegúrate de que este campo sea correcto
        cantidad: detalle.cantidad,
        precio: parseFloat(detalle.precio), // Convierte el precio a número si es una cadena
        referencia: detalle.referencia,
      };
      // Agrega el detalle al arreglo pedidoVentaDetalle usando push
      pedidoVentaDetalle.push(detallePedido);
    }

    // Combinar la cabecera y el detalle en un objeto "pedido" con la estructura deseada
    const pedido: any = {
      moneda_id: pedidoVentaCabecera.moneda_id,
      lista_precio_id: pedidoVentaCabecera.lista_precio_id,
      numero_pedido: pedidoVentaCabecera.numero_pedido,
      observacion: pedidoVentaCabecera.observacion,
      usuario_id: pedidoVentaCabecera.usuario_id,
      detalles: pedidoVentaDetalle,
    };

    try {
      // Llamar al servicio para crear el pedido y esperar la respuesta
      this.pedidoVentaService.createPedidoVentaData(pedido).subscribe(
        (respuesta: any) => {
          // Manejar la respuesta del servidor (por ejemplo, mostrar un mensaje de éxito)
          console.log(respuesta);

          // Asegúrate de que la respuesta contiene el ID del pedido retornado
          this.pedido_venta_id_recuperado = respuesta.id_retornado; // Reemplaza 'id_retornado' con el nombre real del campo en la respuesta

          this.showSuccesAlert('Pedido registrado exitosamente');

          // Abre el modal de impresión
          this.abrirModalImprimir();

          // Continúa con la limpieza de campos y otras acciones después de cerrar el modal
          this.limpiarCampos();
          // Se habilita o deshabilita los botones
          this.botonesForm.get('nuevoHabilitado')?.setValue(false);
          this.botonesForm.get('guardarHabilitado')?.setValue(true);
          this.botonesForm.get('cancelarHabilitado')?.setValue(true);
        },
        (error: any) => {
          // Manejar los errores de la solicitud (por ejemplo, mostrar un mensaje de error)
          console.error('Error al registrar el pedido', error);
          this.showErrorAlert(error.error.message);
        }
      );
    } catch (error: any) {
      console.error('Error al registrar el pedido', error);
      this.showErrorAlert(error.error.message);
    }
  }

  // Función para recalcular el orden de los elementos y obtener el nuevo valor de item_numero
  recalcularOrden(): number {
    // Itera sobre los elementos restantes y establece el nuevo valor de item_numero
    for (let i = 0; i < this.pedidoDetalles.length; i++) {
      this.pedidoDetalles[i].item_numero = i + 1;
    }
    // Retorna el nuevo valor de item_numero
    return this.pedidoDetalles.length + 1;
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
    //Se habilita o deshabilita los botones
    this.botonesForm.get('nuevoHabilitado')?.setValue(false);
    this.botonesForm.get('guardarHabilitado')?.setValue(true);
    this.botonesForm.get('cancelarHabilitado')?.setValue(true);

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
    this.totalArticulos = 0;
    this.totalMonto = 0;
    this.item_numero = 0;
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
      title: 'Atencion',
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

  calcularTotalArticulos() {
    this.totalArticulos = this.pedidoDetalles.reduce((total, detalle) => {
      return total + detalle.cantidad;
    }, 0);
  }

  calcularTotalMonto() {
    this.totalMonto = this.pedidoDetalles.reduce((total, detalle) => {
      return total + parseFloat(detalle.subtotal);
    }, 0);
  }

  obtenerAbreviacionMoneda(monedaId: number): string | undefined {
    const moneda = this.monedas.find(m => m.moneda_id === monedaId);
    return moneda ? moneda.abreviacion : undefined;
  }

  abrirEnNuevaPestana(pedido_venta_id: any) {
    window.open('/pedido_venta_comprobante/' + pedido_venta_id, '_blank');
  }

  abrirModalImprimir() {
    $('#miModalImprimir').modal('show');
  }
}
