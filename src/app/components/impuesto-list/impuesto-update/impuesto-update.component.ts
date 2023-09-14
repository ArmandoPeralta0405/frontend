import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Impuesto } from '../../../models/impuesto.model';
import { ImpuestoService } from '../impuesto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-impuesto-update',
  templateUrl: './impuesto-update.component.html',
  styleUrls: ['./impuesto-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ImpuestoUpdateComponent implements OnInit, OnDestroy {


  impuestoId: any;
  impuestoForm: FormGroup;
  impuestos: Impuesto = {
    impuesto_id: 0,
    descripcion: '',
    valor: 0,
    porcentaje: 0
  };

  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private impuestosService: ImpuestoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.impuestoId = +params['id'];

      // Llama a la función para obtener los datos del impuestos por ID
      this.loadImpuestosData();
    });

    this.impuestoForm = this.fb.group({
      descripcion: ['', Validators.required],
      valor: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  loadImpuestosData() {
    this.impuestosService.getImpuestoById(this.impuestoId).subscribe(
      (response: Impuesto) => {

        this.impuestos = response;

        this.impuestoForm.patchValue(this.impuestos);
      },
      error => {
        console.error('Error al cargar los datos del impuesto:', error);
      }
    );
  }

  updateImpuestosData() {

    if (this.impuestoForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.impuestosService.updateImpuestoData(this.impuestoId, this.impuestoForm.value).subscribe(
        (response) => {

          this.router.navigate(['/dashboard/impuesto']);

          this.impuestosService.notifyDataChange();

          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del impuestos en ImpuestosUpdateComponent:', error);

          this.showErrorAlert('Error al actualizar los datos del impuestos: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.impuestoForm.get(fieldName);
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
