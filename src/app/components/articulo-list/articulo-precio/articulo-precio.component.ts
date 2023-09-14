import { Component, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environment.prod';
import { Articulo, ArticuloVista } from '../../../models/articulo.model';
import { ArticuloListaPrecio, ArticuloListaPrecioVista } from '../../../models/articulo_lista_precio.model';
import { ArticuloService } from '../articulo.service';
import { ArticuloListaPrecioService } from '../articulo-lista-precio.service';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-articulo-precio',
  templateUrl: './articulo-precio.component.html',
  styleUrls: ['./articulo-precio.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ArticuloPrecioComponent {

  cantidadCodigoBarras: number = 1;
  codigosBarras: string[] = [];

  articuloId: any;
  articulo_vista: ArticuloVista = {
    articulo_id: 0,
    descripcion: '',
    codigo_alfanumerico: '',
    marca_id: 0,
    marca_descripcion: '',
    impuesto_id: 0,
    impuesto_descripcion: '',
    unidad_medida_id: 0,
    unidad_medida_descripcion: '',
    estado: false
  };

  articulo_lista_precio: ArticuloListaPrecio[] = [];

  articulo_lista_precio_vista: ArticuloListaPrecioVista[] = []; // Declaración como array


  private subscription: Subscription = new Subscription;

  private successMessageShown = false;
  private redirectionDone = false;

  constructor(
    private articuloService: ArticuloService,
    private route: ActivatedRoute,
    private articuloListaPrecioService: ArticuloListaPrecioService,
    private router: Router
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.articuloId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadArticuloData();
      this.loadArticuloListaPrecio();
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadArticuloData();
    this.loadArticuloListaPrecio();
  }

  // Función para cargar los datos del articulo por ID
  loadArticuloData() {
    this.articuloService.getArticuloByIdView(this.articuloId).subscribe(
      (response: ArticuloVista) => {
        // Almacena los datos del articulo en el modelo
        this.articulo_vista = response;
        // Carga los datos en el formulario
      },
      error => {
        console.error('Error al cargar los datos del articulo:', error);
      }
    );
  }

  // Función para cargar los datos del las listas de precios disponibles

  loadArticuloListaPrecio() {
    this.articuloListaPrecioService.getArticuloListaPrecioById(this.articuloId).subscribe(
      (response: ArticuloListaPrecioVista[]) => {
        // Almacena los datos del articulo en el modelo
        this.articulo_lista_precio_vista = response;
        // Carga los datos en el formulario
      },
      error => {
        console.error('Error al cargar los datos de las listas de precios disponibles:', error);
      }
    );
  }

  // Función para guardar los cambios en el precio de un artículo
  guardarCambiosPrecio() {
    // Contar cuántas actualizaciones se han completado
    let completedUpdates = 0;

    // Recorrer los elementos de la tabla
    for (const item of this.articulo_lista_precio_vista) {
      // Obtener los valores necesarios para la actualización
      const articulo_id = item.articulo_id;
      const lista_precio_id = item.lista_precio_id;
      const precio = item.precio;

      // Crear un objeto de ArticuloListaPrecio
      const datosActualizar: ArticuloListaPrecio = {
        articulo_id,
        lista_precio_id,
        precio
      };

      // Llamar al servicio para actualizar el precio con los datos obtenidos
      this.articuloListaPrecioService.insertarEditarPrecio(datosActualizar).subscribe(
        () => {
          // Incrementar el contador de actualizaciones completadas
          completedUpdates++;

          // Si la operación es exitosa y el mensaje de éxito no se ha mostrado, muestra un mensaje de éxito
          if (!this.successMessageShown && completedUpdates === this.articulo_lista_precio_vista.length) {
            // Emitir un evento en el servicio para notificar cambios
            this.articuloListaPrecioService.notifyDataChange();

            this.showSuccessAlert('Precio actualizado con éxito');

            // Marcar la variable como true para indicar que se mostró el mensaje
            this.successMessageShown = true;

            // Realizar la redirección solo si no se ha hecho ya
            if (!this.redirectionDone) {
              this.router.navigate(['/dashboard/articulo']);
              // Marcar la variable de redirección como true
              this.redirectionDone = true;
            }
          }
        },
        (error) => {
          console.error('Error al actualizar el precio:', error);
          // Si ocurre un error, muestra un mensaje de error
          this.showErrorAlert('Error al actualizar el precio: ' + error.error.message);
        }
      );
    }
  }

  // Función para determinar la máscara adecuada
  getMascara(monedaId: number): string {
    // Si monedaId es igual a 1, usar máscara sin decimales
    if (monedaId === 1) {
      return 'separator.0';
    } else {
      // De lo contrario, usar máscara con 3 decimales
      return 'separator.3';
    }
  }

  // Función para mostrar una alerta de error
  showErrorAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: message,
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }

  // Función para mostrar una alerta de éxito
  showSuccessAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Éxito',
      subtitle: '',
      body: message,
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }

  // Modifica la función generarCodigoBarras para generar múltiples códigos de barras
  generarCodigoBarras() {
    // Obtiene el valor del código alfanumérico
    const codigoAlfanumerico = this.articulo_vista.codigo_alfanumerico;

    // Obtiene la cantidad ingresada por el usuario (puedes ajustarla según tus necesidades)
    const cantidad = this.cantidadCodigoBarras;

    // Limpia el arreglo de códigos de barras antes de agregar nuevos
    this.codigosBarras = [];

    // Genera los códigos de barras según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
      this.codigosBarras.push(codigoAlfanumerico);
    }

    // Abre el modal de código de barras
    $('#codigoBarrasModal').modal('show');
  }

  imprimirCodigosBarras() {
    // Utiliza window.print() para imprimir la parte de la página con los códigos de barras
    window.print();
  }

}
