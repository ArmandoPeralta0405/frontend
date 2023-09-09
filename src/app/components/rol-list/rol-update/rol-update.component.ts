import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Rol } from '../../../models/rol.model';
import { RolService } from '../rol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-rol-update',
  templateUrl: './rol-update.component.html',
  styleUrls: ['./rol-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class RolUpdateComponent implements OnInit, OnDestroy {

  rolId: any;
  rolForm: FormGroup;
  rol: Rol = {
    rol_id: 0,
    descripcion: '',
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private rolService: RolService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.rolId = +params['id'];

      // Llama a la función para obtener los datos del rol por ID
      this.loadRolData();
    });

    this.rolForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del rol por ID
  loadRolData() {
    this.rolService.getRolById(this.rolId).subscribe(
      (response: Rol) => {
        // Almacena los datos del rol en el modelo
        this.rol = response;
        // Carga los datos en el formulario
        this.rolForm.patchValue(this.rol);
      },
      error => {
        console.error('Error al cargar los datos del rol:', error);
      }
    );
  }

  // Función para actualizar los datos del rol
  updateRolData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.rolForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.rolService.updateRolData(this.rolId, this.rolForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/rol']);

          // Emitir un evento en el servicio para notificar cambios
          this.rolService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del rol en RolUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del rol: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.rolForm.get(fieldName);
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
