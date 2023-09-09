import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Articulo, ArticuloVista } from "../../../models/articulo.model";
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
  selector: 'app-articulo-create',
  templateUrl: './articulo-create.component.html',
  styleUrls: ['./articulo-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ArticuloCreateComponent implements OnDestroy {

  articulo_Id: any;
  articuloForm: FormGroup;
  articulos: Articulo = {
    articulo_id: 0,
    descripcion: '',
    codigo_alfanumerico: '',
    marca_id: 0,
    impuesto_id: 0,
    unidad_medida_id: 0,
    estado: false
  };

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  marcas: Marca[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMarcaId: any; // Variable para almacenar el valor seleccionado de marca_id
  impuestos: Impuesto[] = []; // Arreglo para almacenar las impuestos recuperadas
  selectedImpuestoId: any; // Variable para almacenar el valor seleccionado de impuesto_id
  unidades_medidas: UnidadMedida[] = []; // Arreglo para almacenar las unidades de medidas recuperadas
  selectedUnidadMedidaId: any; // Variable para almacenar el valor seleccionado de unidad_medida_id

  constructor(
    private route: ActivatedRoute,
    private articuloService: ArticuloService,
    private router: Router,
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private impuestoService: ImpuestoService,
    private unidadMedidaService: UnidadMedidaService
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.articulo_Id = params['articulo_Id'];
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
    this.articuloService.getArticuloById(this.articulo_Id).subscribe(
      (response: Articulo) => {
        // Almacena los datos del articulo en el modelo
        this.articulos = response;
        // Carga los datos en el formulario
        this.articuloForm.patchValue(this.articulos);
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

  get f() {
    return this.articuloForm.controls;
  }

  createArticuloData() {
    if (this.articuloForm.invalid) {
      return;
    }

    const newArticulo: Articulo = {
      articulo_id: 0,
      descripcion: this.f['descripcion'].value,
      codigo_alfanumerico: this.f['codigo_alfanumerico'].value,
      marca_id: this.f['marca_id'].value,
      impuesto_id:this.f['impuesto_id'].value,
      unidad_medida_id: this.f['unidad_medida_id'].value,
      estado: true
    };

    this.articuloService.createarticuloData(newArticulo).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/articulo']);
        this.articuloService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.articuloForm.get(fieldName);
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

