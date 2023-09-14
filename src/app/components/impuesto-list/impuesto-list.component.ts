import { Component, OnInit, OnDestroy } from '@angular/core';
import { Impuesto } from "../../models/impuesto.model";
import { ImpuestoService } from './impuesto.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery
@Component({
  selector: 'app-impuesto-list',
  templateUrl: './impuesto-list.component.html',
  styleUrls: ['./impuesto-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ImpuestoListComponent implements OnInit, OnDestroy {

  impuestos: Impuesto[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedImpuestoId: number | null = null;
  selectedimpuestostate: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private impuestoService: ImpuestoService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadImpuestos();


    this.impuestoService.getImpuestoSubject().subscribe(() => {
      this.loadImpuestos();
    });
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }

  loadImpuestos() {

    this.destroy$.add(
      this.impuestoService.getImpuestos().subscribe(
        (data: any[]) => {
          this.impuestos = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar impuesto en ImpuestoListComponent', error);
        }
      )
    );
  }

  eliminarImpuesto(ImpuestoId: any) {
    this.impuestoService.deleteImpuesto(ImpuestoId).subscribe(
      (response) => {
        this.loadImpuestos();
        this.showSuccessAlert('Impuesto eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Impuesto: ' + error.error.message);
      }
    );
  }

  selectImpuesto(ImpuestoId: number, estado: boolean) {
    this.selectedImpuestoId = ImpuestoId;
    this.selectedimpuestostate = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.impuestos.length / this.itemsPerPage);
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

  paginateImpuestos(): Impuesto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.impuestos.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.impuestos = this.impuestos.filter((impuestos) => {
        return (
          impuestos.impuesto_id.toString().includes(this.searchTerm) ||
          impuestos.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadImpuestos();
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
