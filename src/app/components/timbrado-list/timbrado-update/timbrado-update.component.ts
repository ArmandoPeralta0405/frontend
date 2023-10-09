import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Timbrado, TimbradoVista } from '../../../models/timbrado.model';
import { TimbradoService } from '../timbrado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { TipoDocumentoService } from "../../tipo-documento-list/tipo-documento.service";
import { TipoDocumento } from "../../../models/tipo_documento.model";
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-timbrado-update',
  templateUrl: './timbrado-update.component.html',
  styleUrls: ['./timbrado-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ]
})
export class TimbradoUpdateComponent implements OnInit, OnDestroy {


  timbradoId: any;
  timbradoForm: FormGroup;
  timbrado: Timbrado = {
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

  tipos_documentos: TipoDocumento[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedTipoDocumentoId: any; // Variable para almacenar el valor seleccionado



  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private timbradoService: TimbradoService,
    private router: Router,
    private fb: FormBuilder,
    private tipoDocumentoService: TipoDocumentoService,
    private datePipe: DatePipe
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.timbradoId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadTimbradoData();
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
    this.loadTipoDocumentos();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos
  loadTimbradoData() {
    this.timbradoService.getTimbradoById(this.timbradoId).subscribe(
      (response: Timbrado) => {
        // Almacena los datos
        this.timbrado = response;
        this.timbrado.fecha_inicial = (this.datePipe.transform(this.timbrado.fecha_inicial?.toString(), 'yyyy-MM-dd'))?.toString();
        this.timbrado.fecha_final = (this.datePipe.transform(this.timbrado.fecha_final?.toString(), 'yyyy-MM-dd'))?.toString();

        this.timbradoForm.patchValue(this.timbrado);

      },
      error => {
        console.error('Error al cargar los datos del timbrado:', error);
      }
    );
  }



  // Función para cargar las tipos_documentos
  loadTipoDocumentos() {
    this.tipoDocumentoService.getTipoDocumentos().subscribe(
      (response: any[]) => {
        this.tipos_documentos = response;
      },
      (error) => {
        console.error('Error al cargar las tipos_documentos:', error);
      }
    );
  }

  // Función para actualizar los datos
  updateTimbradoData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.timbradoForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.timbradoService.updateTimbradoData(this.timbradoId, this.timbradoForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/timbrado']);

          // Emitir un evento en el servicio para notificar cambios
          this.timbradoService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del Timbrado en TimbradoUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del Timbrado: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.timbradoForm.get(fieldName);
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

  // Función para aplicar la máscara "000" a establecimiento
  mascarasTimbrado(value: string, ceros: number): string {
    // Asegurarse de que el valor sea numérico o se pueda convertir en numérico
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      // Aplicar la máscara "000"
      return numericValue.toFixed(0).padStart(ceros, '0');
    }

    // Si el valor no es numérico, devolverlo sin cambios
    return value;
  }
}

