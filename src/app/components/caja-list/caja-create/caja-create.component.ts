import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Caja, CajaVista } from "../../../models/caja.model";
import { CajaService } from '../caja.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { MonedaService } from "../../moneda-list/moneda.service";
import { Moneda } from "../../../models/moneda.model";

declare var $: any;

@Component({
  selector: 'app-caja-create',
  templateUrl: './caja-create.component.html',
  styleUrls: ['./caja-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class CajaCreateComponent implements OnDestroy {

  cajaId: any;
  cajaForm: FormGroup;
  cajas: Caja = {
    caja_id: 0,
    descripcion: '',
    moneda_id: 0,
    estado: true
  };

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  monedas: Moneda[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMonedaId: any; // Variable para almacenar el valor seleccionado


  constructor(
    private route: ActivatedRoute,
    private cajaService: CajaService,
    private router: Router,
    private fb: FormBuilder,
    private monedaService: MonedaService
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.cajaId = params['cajaId'];
    });

    this.cajaForm = this.fb.group({
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
  loadCajaData() {
    this.cajaService.getCajaById(this.cajaId).subscribe(
      (response: Caja) => {
        // Almacena los datos
        this.cajas = response;
        // Carga los datos en el formulario
        this.cajaForm.patchValue(this.cajas);
      },
      error => {
        console.error('Error al cargar los datos de la caja:', error);
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
    return this.cajaForm.controls;
  }

  createCajaData() {
    if (this.cajaForm.invalid) {
      return;
    }

    const newCaja: Caja = {
      caja_id: 0,
      descripcion: this.f['descripcion'].value,
      moneda_id: this.f['moneda_id'].value,
      estado: true
    };

    this.cajaService.createCajaData(newCaja).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/caja']);
        this.cajaService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.cajaForm.get(fieldName);
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



