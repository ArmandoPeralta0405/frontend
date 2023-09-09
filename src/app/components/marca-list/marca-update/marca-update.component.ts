import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../marca.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-marca-update',
  templateUrl: './marca-update.component.html',
  styleUrls: ['./marca-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MarcaUpdateComponent implements OnInit, OnDestroy {

  marca_Id: any;
  marcaForm: FormGroup;
  marca: Marca = {
    marca_id: 0,
    descripcion: '',
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private marcaService: MarcaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.marca_Id = +params['id'];

      // Llama a la función para obtener los datos
      this.loadMarcaData();
    });

    this.marcaForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadMarcaData() {
    this.marcaService.getMarcaById(this.marca_Id).subscribe(
      (response: Marca) => {

        this.marca = response;

        this.marcaForm.patchValue(this.marca);
      },
      error => {
        console.error('Error al cargar los datos del marca:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateMarcaData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.marcaForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.marcaService.updateMarcaData(this.marca_Id, this.marcaForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/marca']);

          // Emitir un evento en el servicio para notificar cambios
          this.marcaService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del marca en marcaUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del marca: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.marcaForm.get(fieldName);
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

