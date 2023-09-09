import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Modulo } from '../../../models/modulo.model';
import { ModuloService } from '../modulo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-modulo-update',
  templateUrl: './modulo-update.component.html',
  styleUrls: ['./modulo-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ModuloUpdateComponent implements OnInit, OnDestroy {

  moduloId: any;
  moduloForm: FormGroup;
  modulo: Modulo = {
    modulo_id: 0,
    descripcion: '',
    abreviacion: '',
    estado: false
  };

  private subscription: Subscription = new Subscription;

  showAbreviacionError = false;

  constructor(
    private route: ActivatedRoute,
    private moduloService: ModuloService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.moduloId = +params['id'];

      // Llama a la función para obtener los datos del modulo por ID
      this.loadModuloData();
    });

    this.moduloForm = this.fb.group({
      descripcion: ['', Validators.required],
      abreviacion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del modulo por ID
  loadModuloData() {
    this.moduloService.getModuloById(this.moduloId).subscribe(
      (response: Modulo) => {
        // Almacena los datos del modulo en el modelo
        this.modulo = response;
        // Carga los datos en el formulario
        this.moduloForm.patchValue(this.modulo);
      },
      error => {
        console.error('Error al cargar los datos del rol:', error);
      }
    );
  }

  // Función para actualizar los datos del modulo
  updateModuloData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.moduloForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.moduloService.updateModuloData(this.moduloId, this.moduloForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/modulo']);

          // Emitir un evento en el servicio para notificar cambios
          this.moduloService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del modulo en ModuloUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del modulo: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.moduloForm.get(fieldName);
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

  onAbreviacionInputChange() {
    const abreviacionControl: FormControl = this.moduloForm.get('abreviacion') as FormControl;
    const abreviacionValue: string = abreviacionControl.value;

    if (abreviacionValue.length === 5) {
      this.showAbreviacionError = false; // La longitud es correcta, no mostramos error
    } else {
      this.showAbreviacionError = true; // La longitud no es 5, mostramos error
    }
  }
}
