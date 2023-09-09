import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Deposito } from '../../../models/deposito.model';
import { DepositoService } from '../deposito.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-deposito-update',
  templateUrl: './deposito-update.component.html',
  styleUrls: ['./deposito-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class DepositoUpdateComponent implements OnInit, OnDestroy {

  deposito_Id: any;
  depositoForm: FormGroup;
  deposito: Deposito = {
    deposito_id: 0,
    descripcion: '',
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private DepositoService: DepositoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.deposito_Id = +params['id'];

      // Llama a la función para obtener los datos
      this.loadDepositoData();
    });

    this.depositoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadDepositoData() {
    this.DepositoService.getDepositoById(this.deposito_Id).subscribe(
      (response: Deposito) => {

        this.deposito = response;

        this.depositoForm.patchValue(this.deposito);
      },
      error => {
        console.error('Error al cargar los datos del deposito:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateDepositoData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.depositoForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.DepositoService.updateDepositoData(this.deposito_Id, this.depositoForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/deposito']);

          // Emitir un evento en el servicio para notificar cambios
          this.DepositoService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del deposito en DepositoUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del deposito: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.depositoForm.get(fieldName);
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

