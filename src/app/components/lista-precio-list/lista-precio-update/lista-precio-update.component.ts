import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ListaPrecio, ListaPrecioVista } from '../../../models/lista_precio.model';
import { ListaPrecioService } from '../lista-precio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { MonedaService } from "../../moneda-list/moneda.service";
import { Moneda } from "../../../models/moneda.model";
declare var $: any;

@Component({
  selector: 'app-lista-precio-update',
  templateUrl: './lista-precio-update.component.html',
  styleUrls: ['./lista-precio-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ListaPrecioUpdateComponent implements OnInit, OnDestroy {
  listaPrecioId: any;
  listaPrecioForm: FormGroup;
  lista_precio: ListaPrecio = {
    lista_precio_id: 0,
    descripcion: '',
    moneda_id: 0
  };

  monedas: Moneda[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMonedaId: any; // Variable para almacenar el valor seleccionado



  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private listaPrecioService: ListaPrecioService,
    private router: Router,
    private fb: FormBuilder,
    private monedaService: MonedaService
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.listaPrecioId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadListaPrecioData();
    });

    this.listaPrecioForm = this.fb.group({
      descripcion: ['', Validators.required],
      moneda_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMonedas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadListaPrecioData() {
    this.listaPrecioService.getListaPrecioById(this.listaPrecioId).subscribe(
      (response: ListaPrecio) => {
        // Almacena los datos del articulo en el modelo
        this.lista_precio = response;
        // Carga los datos en el formulario
        this.listaPrecioForm.patchValue(this.lista_precio);
      },
      error => {
        console.error('Error al cargar los datos de la lista de precio:', error);
      }
    );
  }

  // Función para cargar las monedas
  loadMonedas() {
    this.monedaService.getMonedas().subscribe(
      (response: any[]) => {
        this.monedas = response;
      },
      (error) => {
        console.error('Error al cargar las monedas:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateListaPrecioData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.listaPrecioForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.listaPrecioService.updateListaPrecioData(this.listaPrecioId, this.listaPrecioForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/lista_precio']);

          // Emitir un evento en el servicio para notificar cambios
          this.listaPrecioService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos de la lista de precio en ListaPrecioUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos de la lista de precio: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.listaPrecioForm.get(fieldName);
    return control && control.invalid && control.touched;
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
}
