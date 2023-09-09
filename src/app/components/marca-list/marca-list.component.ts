import { Component, OnInit, OnDestroy } from '@angular/core';
import { Marca } from "../../models/marca.model";
import { MarcaService } from './marca.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery


@Component({
  selector: 'app-marca-list',
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MarcaListComponent {

  marcas: Marca[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedMarcaId: number | null = null;

  private destroy$: Subscription = new Subscription();

  constructor(
    private marcaService: MarcaService
  ) {
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.loadMarcas();

    this.marcaService.getMarcaSubject().subscribe(() => {
      this.loadMarcas();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  loadMarcas() {

    this.destroy$.add(
      this.marcaService.getMarcas().subscribe(
        (data: any[]) => {
          this.marcas = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar marcas en MarcaListComponent', error);
        }
      )
    );
  }

  eliminarMarca(marcaId: any) {
    this.marcaService.deleteMarca(marcaId).subscribe(
      (response) => {
        this.loadMarcas();
        this.showSuccessAlert('Marca eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Marca: ' + error.error.message);
      }
    );
  }

  selectMarca(marcaId: number) {
    this.selectedMarcaId = marcaId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.marcas.length / this.itemsPerPage);
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

  paginatemarcas(): Marca[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.marcas.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.marcas = this.marcas.filter((marca) => {
        return (
          marca.marca_id.toString().includes(this.searchTerm) ||
          marca.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadMarcas();
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
