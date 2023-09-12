import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { FocusService } from '../../../global/focus.service'; // Asegúrate de importar correctamente el servicio


declare var $: any;


@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClienteCreateComponent implements OnDestroy {

  cliente_Id: any;
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

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private fb: FormBuilder,
    private focusService: FocusService
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.cliente_Id = params['cliente_Id'];
    });

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required], // Validación personalizada
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

  // Función para cargar los datos del articulo por ID
  loadClienteData() {
    this.clienteService.getClienteById(this.cliente_Id).subscribe(
      (response: Cliente) => {
        // Almacena los datos del articulo en el modelo
        this.clientes = response;
        // Carga los datos en el formulario
        this.clienteForm.patchValue(this.clientes);
      },
      error => {
        console.error('Error al cargar los datos del cliente:', error);
      }
    );
  }

  get f() {
    return this.clienteForm.controls;
  }

  createClienteData() {
    if (this.clienteForm.invalid) {
      return;
    }

    const newCliente: Cliente = {
      cliente_id: 0,
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      cedula: this.f['cedula'].value,
      telefono:this.f['telefono'].value,
      direccion: this.f['direccion'].value,
      estado: true
    };

    this.clienteService.createClienteData(newCliente).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/cliente']);
        this.clienteService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.clienteForm.get(fieldName);
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

  showSuccesAlert(message: string) {
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

  goToNextField(inputId: string) {
    this.focusService.focusNext(inputId);
  }
}

