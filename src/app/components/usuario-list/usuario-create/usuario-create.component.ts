import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from "../../../models/usuario.model";
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UsuarioCreateComponent implements OnDestroy {

  userId: any;
  usuarioForm: FormGroup;
  usuarios: Usuario[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });

    this.usuarioForm = this.fb.group({
      alias: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cedula_identidad: [''],
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.usuarioForm.controls;
  }

  createUserData() {
    if (this.usuarioForm.invalid) {
      return;
    }

    const newUser: Usuario = {
      usuario_id: 0,
      alias: this.f['alias'].value,
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      email: this.f['email'].value,
      cedula_identidad: this.f['cedula_identidad'].value,
      estado: true
    };

    this.usuarioService.createUserData(newUser).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/usuario']);
        this.usuarioService.notifyDataChange();
        this.showSuccessAlert('Datos registrados correctamente'); // Mostrar alerta de éxito
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message); // Mostrar alerta de error
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.usuarioForm.get(fieldName);
    return control && control.invalid && control.touched;
  }

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
