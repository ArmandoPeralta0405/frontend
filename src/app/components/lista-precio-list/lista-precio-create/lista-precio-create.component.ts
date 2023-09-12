import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListaPrecio, ListaPrecioVista } from "../../../models/lista_precio.model";
import { ListaPrecioService } from '../lista-precio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { MonedaService } from "../../moneda-list/moneda.service";
import { Moneda } from "../../../models/moneda.model";

declare var $: any;

@Component({
  selector: 'app-lista-precio-create',
  templateUrl: './lista-precio-create.component.html',
  styleUrls: ['./lista-precio-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ListaPrecioCreateComponent implements OnDestroy {

  listaPrecioId: any;
  listaPrecioForm: FormGroup;
  listas_precios: ListaPrecio = {
    lista_precio_id: 0,
    descripcion: '',
    moneda_id: 0,
  };

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  monedas: Moneda[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMonedaId: any; // Variable para almacenar el valor seleccionado


  constructor(
    private route: ActivatedRoute,
    private listaPrecioService: ListaPrecioService,
    private router: Router,
    private fb: FormBuilder,
    private monedaService: MonedaService
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.listaPrecioId = params['listaPrecioId'];
    });

    this.listaPrecioForm = this.fb.group({
      descripcion: ['', Validators.required],
      moneda_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMonedas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Función para cargar los datos del articulo por ID
  loadListaPrecioData() {
    this.listaPrecioService.getListaPrecioById(this.listaPrecioId).subscribe(
      (response: ListaPrecio) => {
        // Almacena los datos del articulo en el modelo
        this.listas_precios = response;
        // Carga los datos en el formulario
        this.listaPrecioForm.patchValue(this.listas_precios);
      },
      error => {
        console.error('Error al cargar los datos de la lista de precio:', error);
      }
    );
  }

  // Función para cargar las marcas
  loadMonedas() {
    this.monedaService.getMonedas().subscribe(
      (response: any[]) => {
        this.monedas = response;
      },
      (error) => {
        console.error('Error al cargar las monedas:', error);
      }
    );
  }

  get f() {
    return this.listaPrecioForm.controls;
  }

  createListaPrecioData() {
    if (this.listaPrecioForm.invalid) {
      return;
    }

    const newListaPrecio: ListaPrecio = {
      lista_precio_id: 0,
      descripcion: this.f['descripcion'].value,
      moneda_id: this.f['moneda_id'].value,
    };

    this.listaPrecioService.createListaPrecioData(newListaPrecio).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/lista_precio']);
        this.listaPrecioService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.listaPrecioForm.get(fieldName);
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


