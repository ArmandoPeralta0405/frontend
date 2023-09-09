import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UnidadMedida } from "../../../models/unidad_medida.model";
import { UnidadMedidaService } from '../unidad-medida.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;
@Component({
  selector: 'app-unidad-medida-create',
  templateUrl: './unidad-medida-create.component.html',
  styleUrls: ['./unidad-medida-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UnidadMedidaCreateComponent implements OnDestroy {

  unidad_medidaId: any;
  unidadMedidaForm: FormGroup;
  unidades_medidas: UnidadMedida[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private unidadMedidaService: UnidadMedidaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.unidad_medidaId = params['unidad_medidaId'];
    });

    this.unidadMedidaForm = this.fb.group({
      descripcion: ['', Validators.required],
      abreviacion: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.unidadMedidaForm.controls;
  }

  createUnidadMedidaData() {

    if (this.unidadMedidaForm.invalid) {
      return;
    }

    const newUnidadMedida: UnidadMedida = {
      unidad_medida_id: 0,
      descripcion: this.f['descripcion'].value,
      abreviacion: this.f['abreviacion'].value
    };

    this.unidadMedidaService.createUnidadMedidaData(newUnidadMedida).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/unidad_medida']);
        this.unidadMedidaService.notifyDataChange();
        this.showSuccessAlert('Datos registrados correctamente'); // Mostrar alerta de éxito
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message); // Mostrar alerta de error
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.unidadMedidaForm.get(fieldName);
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
