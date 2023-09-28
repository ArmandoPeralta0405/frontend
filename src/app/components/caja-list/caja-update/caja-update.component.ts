import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Caja, CajaVista } from '../../../models/caja.model';
import { CajaService } from '../caja.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';
import { MonedaService } from "../../moneda-list/moneda.service";
import { Moneda } from "../../../models/moneda.model";

declare var $: any;

@Component({
  selector: 'app-caja-update',
  templateUrl: './caja-update.component.html',
  styleUrls: ['./caja-update.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class CajaUpdateComponent implements OnInit, OnDestroy {
  cajaId: any;
  cajaForm: FormGroup;
  caja: Caja = {
    caja_id: 0,
    descripcion: '',
    moneda_id: 0,
    estado: true
  };

  monedas: Moneda[] = []; // Arreglo para almacenar las marcas recuperadas
  selectedMonedaId: any; // Variable para almacenar el valor seleccionado



  private subscription: Subscription = new Subscription;

  constructor(
    private route: ActivatedRoute,
    private cajaService: CajaService,
    private router: Router,
    private fb: FormBuilder,
    private monedaService: MonedaService
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.cajaId = +params['id'];

      // Llama a la función para obtener los datos del articulo por ID
      this.loadCajaData();
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

  // Función para cargar los datos
  loadCajaData() {
    this.cajaService.getCajaById(this.cajaId).subscribe(
      (response: Caja) => {
        // Almacena los datos
        this.caja = response;
        // Carga los datos en el formulario
        this.cajaForm.patchValue(this.caja);
      },
      error => {
        console.error('Error al cargar los datos de la caja:', error);
      }
    );
  }

  // Función para cargar las monedas
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

  // Función para actualizar los datos
  updateCajaData() {
    // Comprueba si el formulario es válido antes de enviar los datos
    if (this.cajaForm.valid) {
      // Realiza la actualización solo si el formulario es válido
      this.cajaService.updateCajaData(this.cajaId, this.cajaForm.value).subscribe(
        (response) => {
          // Puedes redirigir al usuario a otra página después de la actualización
          this.router.navigate(['/dashboard/caja']);

          // Emitir un evento en el servicio para notificar cambios
          this.cajaService.notifyDataChange();

          // Mostrar una alerta de éxito
          this.showSuccessAlert('Datos actualizados correctamente');
        },
        (error) => {
          console.error('Error al actualizar los datos de la caja en CajaUpdateComponent:', error);

          // Mostrar una alerta de error
          this.showErrorAlert('Error al actualizar los datos de la caja: ' + error.error.message);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string) {
    const control = this.cajaForm.get(fieldName);
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
