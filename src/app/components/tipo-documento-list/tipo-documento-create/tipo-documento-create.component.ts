import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoDocumento } from "../../../models/tipo_documento.model";
import { TipoDocumentoService } from '../tipo-documento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-tipo-documento-create',
  templateUrl: './tipo-documento-create.component.html',
  styleUrls: ['./tipo-documento-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoDocumentoCreateComponent implements OnDestroy {

  tipo_documento_Id: any;
  tipo_documentoForm: FormGroup;
  tipos_documentos: TipoDocumento[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private tipo_documentoService: TipoDocumentoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.tipo_documento_Id = params['tipo_documento_Id'];
    });

    this.tipo_documentoForm = this.fb.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.tipo_documentoForm.controls;
  }

  createTipoDocumentoData() {
    if (this.tipo_documentoForm.invalid) {
      return;
    }

    const newTipoDocumento: TipoDocumento = {
      tipo_documento_id: 0,
      descripcion: this.f['descripcion'].value
    };

    this.tipo_documentoService.createTipoDocumentoData(newTipoDocumento).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/tipo_documento']);
        this.tipo_documentoService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.tipo_documentoForm.get(fieldName);
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

