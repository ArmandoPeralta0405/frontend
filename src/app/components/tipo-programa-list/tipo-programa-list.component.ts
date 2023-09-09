import { Component, OnInit, OnDestroy } from '@angular/core';
import { TipoPrograma } from "../../models/tipo_programa.model";
import { TipoProgramaService } from './tipo-programa.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-tipo-programa-list',
  templateUrl: './tipo-programa-list.component.html',
  styleUrls: ['./tipo-programa-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoProgramaListComponent {

  tipo_programas: TipoPrograma[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedTipoProgramaId: number | null = null;

  private destroy$: Subscription = new Subscription();

  constructor(
    private tipoProgramaService: TipoProgramaService
  ) {
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.loadTipoProgramas();

    // Suscríbete al Subject para detectar cambios en los datos
    this.tipoProgramaService.getTipoProgramaSubject().subscribe(() => {
      this.loadTipoProgramas(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }
  ngOnDestroy(): void {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadTipoProgramas() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.tipoProgramaService.getTipoProgramas().subscribe(
        (data: any[]) => {
          this.tipo_programas = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar Tipos de progranas en TipoProgramaListComponent', error);
        }
      )
    );
  }

  eliminarTipoPrograma(tipoProgramaId: any) {
    this.tipoProgramaService.deleteTipoPrograma(tipoProgramaId).subscribe(
      (response) => {
        this.loadTipoProgramas();
        this.showSuccessAlert('Tipo de Programa eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Tipo de Programa: ' + error.error.message);
      }
    );
  }

  selectTipoPrograma(tipoProgramaId: number) {
    this.selectedTipoProgramaId = tipoProgramaId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.tipo_programas.length / this.itemsPerPage);
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

  paginateTipoProgramas(): TipoPrograma[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tipo_programas.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.tipo_programas = this.tipo_programas.filter((tipo_programa) => {
        return (
          tipo_programa.tipo_programa_id.toString().includes(this.searchTerm) ||
          tipo_programa.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadTipoProgramas();
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
