import { Component, OnInit, OnDestroy } from '@angular/core';
import { Articulo, ArticuloVista } from "../../models/articulo.model";
import { ArticuloService } from './articulo.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-articulo-list',
  templateUrl: './articulo-list.component.html',
  styleUrls: ['./articulo-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ArticuloListComponent implements OnInit, OnDestroy {

  articulos: Articulo[] = [];
  articulos_v: ArticuloVista[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedArticuloId: number | null = null;
  selectedArticuloState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private articuloService: ArticuloService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadArticulos();

    // Suscríbete al Subject para detectar cambios en los datos
    this.articuloService.getarticuloSubject().subscribe(() => {
      this.loadArticulos(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadArticulos() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.articuloService.getArticulos().subscribe(
        (data: any[]) => {
          this.articulos_v = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar articulos en ArticuloListComponent', error);
        }
      )
    );
  }

  updateEstado(estado: boolean, id: any) {

    this.articuloService.updateArticuloEstado(id, estado).subscribe(
      (response) => {
        this.loadArticulos();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarArticulo(articuloId: any) {
    this.articuloService.deleteArticulo(articuloId).subscribe(
      (response) => {
        this.loadArticulos();
        this.showSuccessAlert('Articulo eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el articulo: ' + error.error.message);
      }
    );
  }

  selectArticulo(moduloId: number, estado: boolean) {
    this.selectedArticuloId = moduloId;
    this.selectedArticuloState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.articulos_v.length / this.itemsPerPage);
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

  paginateArticulos(): ArticuloVista[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.articulos_v.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.articulos_v = this.articulos_v.filter((articulos_v) => {
        return (
          articulos_v.articulo_id.toString().includes(this.searchTerm) ||
          articulos_v.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          articulos_v.codigo_alfanumerico.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          articulos_v.marca_descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          articulos_v.impuesto_descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          articulos_v.unidad_medida_descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadArticulos();
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
