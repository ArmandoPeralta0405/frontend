import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Cliente} from '../../../models/cliente.model';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { FocusService } from '../../../global/focus.service';

declare var $: any;

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClienteUpdateComponent implements OnInit, OnDestroy {
  clienteId: any;
  clienteForm: FormGroup;
  clientes: Cliente = {
    cliente_id: 0,
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    estado: false
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private fb: FormBuilder,
    private focusService: FocusService
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.clienteId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadClienteData();
    });

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: [],
      direccion: []
    });
  }

  ngOnInit() {
    this.goToNextField('txtNombre');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadClienteData() {
    this.clienteService.getClienteById(this.clienteId).subscribe(
      (response: Cliente) => {
        this.clientes = response;
        // Carga los datos en el formulario
        this.clienteForm.patchValue(this.clientes);
      },
      error => {
        console.error('Error al cargar los datos del cliente:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateClienteData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    console.log(this.clienteForm);

    if (this.clienteForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.clienteService.updateClienteData(this.clienteId, this.clienteForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/cliente']);

          // Emitir un evento en el servicio para notificar cambios
          this.clienteService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del cliente en ClienteUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del cliente: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.clienteForm.get(fieldName);
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

  goToNextField(inputId: string) {
    this.focusService.focusNext(inputId);
  }
}
