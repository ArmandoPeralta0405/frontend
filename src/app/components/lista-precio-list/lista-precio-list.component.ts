import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListaPrecio, ListaPrecioVista } from "../../models/lista_precio.model";
import { ListaPrecioService } from './lista-precio.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-lista-precio-list',
  templateUrl: './lista-precio-list.component.html',
  styleUrls: ['./lista-precio-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ListaPrecioListComponent implements OnInit, OnDestroy {

  listas_precios: ListaPrecio[] = [];
  listas_precios_v: ListaPrecioVista[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedListaPrecioId: number | null = null;

  private destroy$: Subscription = new Subscription();


  constructor(
    private listaPrecioService: ListaPrecioService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadListasPrecios();

    // Suscríbete al Subject para detectar cambios en los datos
    this.listaPrecioService.getlista_precioSubject().subscribe(() => {
      this.loadListasPrecios(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadListasPrecios() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.listaPrecioService.getListasPrecios().subscribe(
        (data: any[]) => {
          this.listas_precios_v = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar listas de precios en ListaPrecioListComponent', error);
        }
      )
    );
  }

  eliminarListaPrecio(listasPrecioId: any) {
    this.listaPrecioService.deleteListaPrecio(listasPrecioId).subscribe(
      (response) => {
        this.loadListasPrecios();
        this.showSuccessAlert('Lista de precio eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar la lista de precio: ' + error.error.message);
      }
    );
  }

  selectListaPrecio(listaPrecioId: number, estado: boolean) {
    this.selectedListaPrecioId = listaPrecioId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.listas_precios_v.length / this.itemsPerPage);
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

  paginateListasPrecios(): ListaPrecioVista[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listas_precios_v.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.listas_precios_v = this.listas_precios_v.filter((listas_precios_v) => {
        return (
          listas_precios_v.lista_precio_id.toString().includes(this.searchTerm) ||
          listas_precios_v.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          listas_precios_v.moneda_descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadListasPrecios();
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
