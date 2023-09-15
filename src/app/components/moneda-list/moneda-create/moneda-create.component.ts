import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Moneda } from "../../../models/moneda.model";
import { MonedaService } from '../moneda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-moneda-create',
  templateUrl: './moneda-create.component.html',
  styleUrls: ['./moneda-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MonedaCreateComponent implements OnDestroy {

  monedaId: any;
  monedaForm: FormGroup;
  monedas: Moneda[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private monedaService: MonedaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.monedaId = params['monedaId'];
    });

    this.monedaForm = this.fb.group({
      descripcion: ['', Validators.required],
      abreviacion: ['', Validators.required],
      decimal: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.monedaForm.controls;
  }

  createMonedaData() {

    if (this.monedaForm.invalid) {
      return;
    }

    const newMoneda: Moneda = {
      moneda_id: 0,
      descripcion: this.f['descripcion'].value,
      abreviacion: this.f['abreviacion'].value,
      decimal: this.f['decimal'].value
    };
    console.log(newMoneda);

    this.monedaService.createMonedaData(newMoneda).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/moneda']);
        this.monedaService.notifyDataChange();
        this.showSuccessAlert('Datos registrados correctamente'); // Mostrar alerta de éxito
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message); // Mostrar alerta de error
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.monedaForm.get(fieldName);
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
