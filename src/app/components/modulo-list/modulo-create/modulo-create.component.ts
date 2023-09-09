import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Modulo } from "../../../models/modulo.model";
import { ModuloService } from '../modulo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-modulo-create',
  templateUrl: './modulo-create.component.html',
  styleUrls: ['./modulo-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})

export class ModuloCreateComponent implements OnDestroy {

  moduloId: any;
  moduloForm: FormGroup;
  modulos: Modulo[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  showAbreviacionError = false;

  constructor(
    private route: ActivatedRoute,
    private moduloService: ModuloService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.moduloId = params['moduloId'];
    });

    this.moduloForm = this.fb.group({
      descripcion: ['', Validators.required],
      abreviacion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.moduloForm.controls;
  }

  createModuloData() {
    if (this.moduloForm.invalid) {
      return;
    }

    const abreviacionControl: any = this.moduloForm.get('abreviacion');
    if (abreviacionControl.value.length !== 5) {
      // La abreviación no tiene 5 caracteres, muestra el mensaje de error
      this.showAbreviacionError = true;
      return;
    } else {
      // La abreviación tiene 5 caracteres, oculta el mensaje de error si se mostró anteriormente
      this.showAbreviacionError = false;
    }

    const newModulo: Modulo = {
      modulo_id: 0,
      descripcion: this.f['descripcion'].value,
      abreviacion: this.f['abreviacion'].value,
      estado: true
    };

    this.moduloService.createModuloData(newModulo).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/modulo']);
        this.moduloService.notifyDataChange();
        this.showSuccessAlert('Datos registrados correctamente'); // Mostrar alerta de éxito
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message); // Mostrar alerta de error
      }
    );
  }

  onAbreviacionInputChange() {
    const abreviacionControl: FormControl = this.moduloForm.get('abreviacion') as FormControl;
    const abreviacionValue: string = abreviacionControl.value;

    if (abreviacionValue.length === 5) {
      this.showAbreviacionError = false; // La longitud es correcta, no mostramos error
    } else {
      this.showAbreviacionError = true; // La longitud no es 5, mostramos error
    }
  }


  isFieldInvalid(fieldName: string) {
    const control = this.moduloForm.get(fieldName);
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
