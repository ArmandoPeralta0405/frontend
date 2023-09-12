import { Component, OnInit, OnDestroy } from '@angular/core';
import { Moneda } from "../../models/moneda.model";
import { MonedaService } from './moneda.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-moneda-list',
  templateUrl: './moneda-list.component.html',
  styleUrls: ['./moneda-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MonedaListComponent implements OnInit, OnDestroy {

  monedas: Moneda[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedMonedaId: number | null = null;
  selectedMonedaState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private monedaService: MonedaService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadMoneda();

    // Suscríbete al Subject para detectar cambios en los datos
    this.monedaService.getmonedaSubject().subscribe(() => {
      this.loadMoneda(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadMoneda() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.monedaService.getMonedas().subscribe(
        (data: any[]) => {
          this.monedas = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar Monedas en MonedaListComponent', error);
        }
      )
    );
  }

  eliminarMoneda(monedaId: any) {
    this.monedaService.deleteMoneda(monedaId).subscribe(
      (response) => {
        this.loadMoneda();
        this.showSuccessAlert('Moneda eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Moneda: ' + error.error.message);
      }
    );
  }

  selectMoneda(monedaId: number, estado: boolean) {
    this.selectedMonedaId = monedaId;
    this.selectedMonedaState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.monedas.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  paginateMonedas(): Moneda[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.monedas.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.monedas = this.monedas.filter((moneda) => {
        return (
          moneda.moneda_id.toString().includes(this.searchTerm) ||
          moneda.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          moneda.abreviacion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadMoneda();
    }
  }

  // Función para mostrar una alerta de error
  showErrorAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: message
    });

    // Programa el cierre de la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
      $('.toast').toast('hide'); // Cierra la alerta
    }, 5000);
  }

  // Función para mostrar una alerta de éxito
  showSuccessAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Éxito',
      subtitle: '',
      body: message
    });

    // Programa el cierre de la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
      $('.toast').toast('hide'); // Cierra la alerta
    }, 5000);
  }

}

