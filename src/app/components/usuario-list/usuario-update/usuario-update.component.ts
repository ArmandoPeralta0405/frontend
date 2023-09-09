import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from "../../../models/usuario.model";
import { UsuarioService } from '../usuario.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UsuarioUpdateComponent implements OnInit, OnDestroy {
  userId: any;
  usuario: Usuario = {
    usuario_id: 0,
    alias: '',
    nombre: '',
    apellido: '',
    email: '',
    cedula_identidad: '',
    estado: false
  };

  usuarioForm: FormGroup;

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializa el formulario con validadores
    this.usuarioForm = this.fb.group({
      alias: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cedula_identidad: [''],
    });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.userId = +params['id']; // Obtén el usuario_id de los parámetros de ruta como número

      // Llama a la función para obtener los datos del usuario por ID
      this.loadUserData();
    });
  }

  ngOnDestroy() {
    // Asegúrate de desuscribirte para evitar pérdida de memoria
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del usuario por ID
  loadUserData() {
    this.usuarioService.getUserById(this.userId).subscribe(
      (response: Usuario) => {
        // Almacena los datos del usuario en el modelo
        this.usuario = response;
        // Carga los datos en el formulario
        this.usuarioForm.patchValue(this.usuario);
      },
      error => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }

  // Función para actualizar los datos del usuario
  updateUserData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.usuarioForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.usuarioService.updateUserData(this.userId, this.usuarioForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/usuario']);

          // Emitir un evento en el Subject para notificar cambios
          this.usuarioService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del usuario en UsuarioUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del usuario: ' + error.error.message);
        }
      );
    }
  }

  // Verifica si un campo del formulario está inválido y tocado
  isFieldInvalid(fieldName: string) {
    const control = this.usuarioForm.get(fieldName);
    return control && control.invalid && control.touched;
  }

  // Función para mostrar una alerta de error
  showErrorAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: message
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
      body: message
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }
}
