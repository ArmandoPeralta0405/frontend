import { Component, OnInit, OnDestroy } from '@angular/core';
import { Deposito } from "../../models/deposito.model";
import { DepositoService } from './deposito.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-deposito-list',
  templateUrl: './deposito-list.component.html',
  styleUrls: ['./deposito-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class DepositoListComponent {

  depositos: Deposito[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedDepositoId: number | null = null;

  private destroy$: Subscription = new Subscription();

  constructor(
    private DepositoService: DepositoService
  ) {
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.loadDepositos();

    this.DepositoService.getDepositoSubject().subscribe(() => {
      this.loadDepositos();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  loadDepositos() {

    this.destroy$.add(
      this.DepositoService.getDepositos().subscribe(
        (data: any[]) => {
          this.depositos = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar depositos en DepositoListComponent', error);
        }
      )
    );
  }

  eliminarDeposito(DepositoId: any) {
    this.DepositoService.deleteDeposito(DepositoId).subscribe(
      (response) => {
        this.loadDepositos();
        this.showSuccessAlert('Deposito eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Deposito: ' + error.error.message);
      }
    );
  }

  selectDeposito(DepositoId: number) {
    this.selectedDepositoId = DepositoId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.depositos.length / this.itemsPerPage);
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

  paginateDepositos(): Deposito[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.depositos.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.depositos = this.depositos.filter((deposito) => {
        return (
          deposito.deposito_id.toString().includes(this.searchTerm) ||
          deposito.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadDepositos();
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
