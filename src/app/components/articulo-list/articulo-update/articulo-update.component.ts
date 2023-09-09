import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Articulo, ArticuloVista } from '../../../models/articulo.model';
import { ArticuloService } from '../articulo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { MarcaService } from "../../marca-list/marca.service";
import { Marca } from "../../../models/marca.model";
import { Impuesto } from "../../../models/impuesto.model";
import { ImpuestoService } from '../../impuesto-list/impuesto.service';
import { UnidadMedida } from 'src/app/models/unidad_medida.model';
import { UnidadMedidaService } from '../../unidad-medida-list/unidad-medida.service';

declare var $: any;

@Component({
  selector: 'app-articulo-update',
  templateUrl: './articulo-update.component.html',
  styleUrls: ['./articulo-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ArticuloUpdateComponent implements OnInit, OnDestroy {
  articuloId: any;
  articuloForm: FormGroup;
  articulo: Articulo = {
    articulo_id: 0,
    descripcion: '',
    codigo_alfanumerico: '',
    marca_id: 0,
    impuesto_id: 0,
    unidad_medida_id: 0,
    estado: false
  };

  marcas: Marca[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMarcaId: any; // Variable para almacenar el valor seleccionado de marca_id
  impuestos: Impuesto[] = []; // Arreglo para almacenar las impuestos recuperadas
  selectedImpuestoId: any; // Variable para almacenar el valor seleccionado de impuesto_id
  unidades_medidas: UnidadMedida[] = []; // Arreglo para almacenar las unidades de medidas recuperadas
  selectedUnidadMedidaId: any; // Variable para almacenar el valor seleccionado de unidad_medida_id


  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private articuloService: ArticuloService,
    private router: Router,
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private impuestoService: ImpuestoService,
    private unidadMedidaService: UnidadMedidaService
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.articuloId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadArticuloData();
    });

    this.articuloForm = this.fb.group({
      descripcion: ['', Validators.required],
      codigo_alfanumerico: ['', Validators.required],
      marca_id: ['', Validators.required], // Validación personalizada
      impuesto_id: ['', Validators.required], // Validación personalizada
      unidad_medida_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMarcas();
    this.loadImpuestos();
    this.loadUnidadesMedidas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del articulo por ID
  loadArticuloData() {
    this.articuloService.getArticuloById(this.articuloId).subscribe(
      (response: Articulo) => {
        // Almacena los datos del articulo en el modelo
        this.articulo = response;
        // Carga los datos en el formulario
        this.articuloForm.patchValue(this.articulo);
      },
      error => {
        console.error('Error al cargar los datos del articulo:', error);
      }
    );
  }

  // Función para cargar las marcas
  loadMarcas() {
    this.marcaService.getMarcas().subscribe(
      (response: any[]) => {
        this.marcas = response;
      },
      (error) => {
        console.error('Error al cargar las marcas:', error);
      }
    );
  }

  // Función para cargar los impuestos
  loadImpuestos() {
    this.impuestoService.getImpuestos().subscribe(
      (response: any[]) => {
        this.impuestos = response;
      },
      (error) => {
        console.error('Error al cargar los impuestos:', error);
      }
    );
  }

  // Función para cargar los unidades de medidas
  loadUnidadesMedidas() {
    this.unidadMedidaService.getUnidadesMedidas().subscribe(
      (response: any[]) => {
        this.unidades_medidas = response;
      },
      (error) => {
        console.error('Error al cargar las unidades de medidas:', error);
      }
    );
  }

  // Función para actualizar los datos del articulo
  updatearticuloData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.articuloForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.articuloService.updateArticuloData(this.articuloId, this.articuloForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/articulo']);

          // Emitir un evento en el servicio para notificar cambios
          this.articuloService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos del articulo en articuloUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos del articulo: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.articuloForm.get(fieldName);
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
