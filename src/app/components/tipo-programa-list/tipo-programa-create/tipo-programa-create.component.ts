import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoPrograma } from "../../../models/tipo_programa.model";
import { TipoProgramaService } from '../tipo-programa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-tipo-programa-create',
  templateUrl: './tipo-programa-create.component.html',
  styleUrls: ['./tipo-programa-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoProgramaCreateComponent implements OnDestroy {

  tipo_programa_Id: any;
  tipo_programa_Form: FormGroup;
  tipo_programas: TipoPrograma[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private tipoProgramaService: TipoProgramaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.tipo_programa_Id = params['tipo_programa_Id'];
    });

    this.tipo_programa_Form = this.fb.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.tipo_programa_Form.controls;
  }

  createTipoProgramaData() {
    if (this.tipo_programa_Form.invalid) {
      return;
    }

    const newTipoPrograma: TipoPrograma = {
      tipo_programa_id: 0,
      descripcion: this.f['descripcion'].value
    };

    this.tipoProgramaService.createTipoProgramaData(newTipoPrograma).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/tipo_programa']);
        this.tipoProgramaService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.tipo_programa_Form.get(fieldName);
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
}
