import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Impuesto } from "../../../models/impuesto.model";
import { ImpuestoService } from '../impuesto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;


@Component({
  selector: 'app-impuesto-create',
  templateUrl: './impuesto-create.component.html',
  styleUrls: ['./impuesto-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ImpuestoCreateComponent implements OnDestroy {

  impuestoId: any;
  impuestoForm: FormGroup;
  impuestos: Impuesto[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  showAbreviacionError = false;

  constructor(
    private route: ActivatedRoute,
    private impuestoService: ImpuestoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.impuestoId = params['impuestoId'];
    });

    this.impuestoForm = this.fb.group({
      descripcion: ['', Validators.required],
      valor: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.impuestoForm.controls;
  }

  createImpuestoData() {
    if (this.impuestoForm.invalid) {
      return;
    }

    const newImpuesto: Impuesto = {
      impuesto_id: 0,
      descripcion: this.f['descripcion'].value,
      valor: this.f['valor'].value,
      porcentaje: this.f['porcentaje'].value,
    };

    this.impuestoService.createImpuestoData(newImpuesto).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/impuesto']);
        this.impuestoService.notifyDataChange();
        this.showSuccessAlert('Datos registrados correctamente'); // Mostrar alerta de éxito
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message); // Mostrar alerta de error
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.impuestoForm.get(fieldName);
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
