import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Moneda } from '../../../models/moneda.model';
import { MonedaService } from '../moneda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-moneda-update',
  templateUrl: './moneda-update.component.html',
  styleUrls: ['./moneda-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MonedaUpdateComponent implements OnInit, OnDestroy {


  moneda_Id: any;
  monedaForm: FormGroup;
  monedas: Moneda = {
    moneda_id: 0,
    descripcion: '',
    abreviacion: ''
  };

  private subscription: Subscription = new Subscription;

  showAbreviacionError = false;

  constructor(
    private route: ActivatedRoute,
    private monedaService: MonedaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.moneda_Id = +params['id'];

      // Llama a la función para obtener los datos del modulo por ID
      this.loadMonedaData();
    });

    this.monedaForm = this.fb.group({
      descripcion: ['', Validators.required],
      abreviacion: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del modulo por ID
  loadMonedaData() {
    this.monedaService.getMonedaById(this.moneda_Id).subscribe(
      (response: Moneda) => {
        // Almacena los datos del modulo en el modelo
        this.monedas = response;
        // Carga los datos en el formulario
        this.monedaForm.patchValue(this.monedas);
      },
      error => {
        console.error('Error al cargar los datos de las monedas:', error);
      }
    );
  }

  updateMonedaData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.monedaForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.monedaService.updateMonedaData(this.moneda_Id, this.monedaForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/moneda']);

          // Emitir un evento en el servicio para notificar cambios
          this.monedaService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos de la moneda en MonedaUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos de la moneda: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.monedaForm.get(fieldName);
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
