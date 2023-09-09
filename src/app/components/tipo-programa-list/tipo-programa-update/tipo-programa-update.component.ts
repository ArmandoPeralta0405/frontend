import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoPrograma } from '../../../models/tipo_programa.model';
import { TipoProgramaService } from '../tipo-programa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery
@Component({
  selector: 'app-tipo-programa-update',
  templateUrl: './tipo-programa-update.component.html',
  styleUrls: ['./tipo-programa-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoProgramaUpdateComponent implements OnInit, OnDestroy {

  tipo_programa_Id: any;
  tipo_programa_Form: FormGroup;
  tipo_programa: TipoPrograma = {
    tipo_programa_id: 0,
    descripcion: '',
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private tipoProgramaService: TipoProgramaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.tipo_programa_Id = +params['id'];

      // Llama a la función para obtener los datos
      this.loadTipoProgramaData();
    });

    this.tipo_programa_Form = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadTipoProgramaData() {
    this.tipoProgramaService.getTipoProgramaById(this.tipo_programa_Id).subscribe(
      (response: TipoPrograma) => {
        // Almacena los datos del rol en el modelo
        this.tipo_programa = response;
        // Carga los datos en el formulario
        this.tipo_programa_Form.patchValue(this.tipo_programa);
      },
      error => {
        console.error('Error al cargar los datos del tipo de programa:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateTipoProgramaData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.tipo_programa_Form.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.tipoProgramaService.updateTipoProgramaData(this.tipo_programa_Id, this.tipo_programa_Form.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/tipo_programa']);

          // Emitir un evento en el servicio para notificar cambios
          this.tipoProgramaService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del tipo de programa en TipoProgramaUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del tipo programa: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.tipo_programa_Form.get(fieldName);
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
