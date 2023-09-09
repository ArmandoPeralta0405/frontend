import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UnidadMedida } from '../../../models/unidad_medida.model';
import { UnidadMedidaService } from '../unidad-medida.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-unidad-medida-update',
  templateUrl: './unidad-medida-update.component.html',
  styleUrls: ['./unidad-medida-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UnidadMedidaUpdateComponent implements OnInit, OnDestroy {


  unidad_medida_Id: any;
  unidadMedidaForm: FormGroup;
  unidades_medidas: UnidadMedida = {
    unidad_medida_id: 0,
    descripcion: '',
    abreviacion: ''
  };

  private subscription: Subscription = new Subscription;

  showAbreviacionError = false;

  constructor(
    private route: ActivatedRoute,
    private unidadMedidaService: UnidadMedidaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.unidad_medida_Id = +params['id'];

      // Llama a la función para obtener los datos del modulo por ID
      this.loadUnidadMedidaData();
    });

    this.unidadMedidaForm = this.fb.group({
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
  loadUnidadMedidaData() {
    this.unidadMedidaService.getUnidadMedidaById(this.unidad_medida_Id).subscribe(
      (response: UnidadMedida) => {
        // Almacena los datos del modulo en el modelo
        this.unidades_medidas = response;
        // Carga los datos en el formulario
        this.unidadMedidaForm.patchValue(this.unidades_medidas);
      },
      error => {
        console.error('Error al cargar los datos de las unidades de medidas:', error);
      }
    );
  }

  updateUnidadMedidaData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.unidadMedidaForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.unidadMedidaService.updateUnidadMedidaData(this.unidad_medida_Id, this.unidadMedidaForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/unidad_medida']);

          // Emitir un evento en el servicio para notificar cambios
          this.unidadMedidaService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos de la unidad de medida en UnidadMedidaUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos de la unidad de medida: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.unidadMedidaForm.get(fieldName);
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
