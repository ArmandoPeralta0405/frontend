import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoDocumento } from '../../../models/tipo_documento.model';
import { TipoDocumentoService } from '../tipo-documento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-tipo-documento-update',
  templateUrl: './tipo-documento-update.component.html',
  styleUrls: ['./tipo-documento-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoDocumentoUpdateComponent implements OnInit, OnDestroy {

  tipo_documento_Id: any;
  tipo_documentoForm: FormGroup;
  tipo_documento: TipoDocumento = {
    tipo_documento_id: 0,
    descripcion: '',
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private tipo_documentoService: TipoDocumentoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.tipo_documento_Id = +params['id'];

      // Llama a la función para obtener los datos
      this.loadTipoDocumentoData();
    });

    this.tipo_documentoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadTipoDocumentoData() {
    this.tipo_documentoService.getTipoDocumentoById(this.tipo_documento_Id).subscribe(
      (response: TipoDocumento) => {

        this.tipo_documento = response;

        this.tipo_documentoForm.patchValue(this.tipo_documento);
      },
      error => {
        console.error('Error al cargar los datos del tipo de documento:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateTipoDocumentoData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.tipo_documentoForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.tipo_documentoService.updateTipoDocumentoData(this.tipo_documento_Id, this.tipo_documentoForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/tipo_documento']);

          // Emitir un evento en el servicio para notificar cambios
          this.tipo_documentoService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del tipo_documento en TipoDocumentoUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del tipo_documento: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.tipo_documentoForm.get(fieldName);
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

