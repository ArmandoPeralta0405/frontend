import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Timbrado, TimbradoVista } from "../../../models/timbrado.model";
import { TimbradoService } from '../timbrado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { TipoDocumentoService } from "../../tipo-documento-list/tipo-documento.service";
import { TipoDocumento } from "../../../models/tipo_documento.model";
import { DatePipe } from '@angular/common';

declare var $: any;


@Component({
  selector: 'app-timbrado-create',
  templateUrl: './timbrado-create.component.html',
  styleUrls: ['./timbrado-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TimbradoCreateComponent implements OnDestroy {

  timbradoId: any;
  timbradoForm: FormGroup;
  timbrados: Timbrado = {
    timbrado_id: 0,
    numero: 0,
    establecimiento: 0,
    punto_emision: 0,
    numero_inicial: 0,
    numero_final: 0,
    fecha_inicial: '',
    fecha_final: '',
    estado: true,
    tipo_documento_id: 0
  };

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  tiposDocumentos: TipoDocumento[] = [];
  selectedTipoDocumentoId: any;


  constructor(
    private route: ActivatedRoute,
    private timbradoService: TimbradoService,
    private router: Router,
    private fb: FormBuilder,
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.timbradoId = params['timbradoId'];
    });

    this.timbradoForm = this.fb.group({
      numero: ['', Validators.required],
      establecimiento: ['', Validators.required],
      punto_emision: ['', Validators.required],
      numero_inicial: ['', Validators.required],
      numero_final: ['', Validators.required],
      fecha_inicial: ['', Validators.required],
      fecha_final: ['', Validators.required],
      tipo_documento_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadMonedas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar las marcas
  loadMonedas() {
    this.tipoDocumentoService.getTipoDocumentos().subscribe(
      (response: any[]) => {
        this.tiposDocumentos = response;
      },
      (error) => {
        console.error('Error al cargar las tipos de documentos:', error);
      }
    );
  }

  get f() {
    return this.timbradoForm.controls;
  }

  createTimbradoData() {
    if (this.timbradoForm.invalid) {
      return;
    }

    const newTimbrado: Timbrado = {
      timbrado_id: 0,
      numero: this.f['numero'].value,
      establecimiento: this.f['establecimiento'].value,
      punto_emision: this.f['punto_emision'].value,
      numero_inicial: this.f['numero_inicial'].value,
      numero_final: this.f['numero_final'].value,
      fecha_inicial: this.f['fecha_inicial'].value,
      fecha_final: this.f['fecha_final'].value,
      estado: true,
      tipo_documento_id: this.f['tipo_documento_id'].value,
    };

    this.timbradoService.createTimbradoData(newTimbrado).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/timbrado']);
        this.timbradoService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.timbradoForm.get(fieldName);
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


