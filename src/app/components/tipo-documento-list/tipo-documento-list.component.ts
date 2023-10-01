import { Component, OnInit, OnDestroy } from '@angular/core';
import { TipoDocumento } from "../../models/tipo_documento.model";
import { TipoDocumentoService } from './tipo-documento.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-tipo-documento-list',
  templateUrl: './tipo-documento-list.component.html',
  styleUrls: ['./tipo-documento-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TipoDocumentoListComponent {

  tipos_documentos: TipoDocumento[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedTipoDocumentoId: number | null = null;

  private destroy$: Subscription = new Subscription();

  constructor(
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.loadTipoDocumentos();

    this.tipoDocumentoService.getTipoDocumentoSubject().subscribe(() => {
      this.loadTipoDocumentos();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  loadTipoDocumentos() {

    this.destroy$.add(
      this.tipoDocumentoService.getTipoDocumentos().subscribe(
        (data: any[]) => {
          this.tipos_documentos = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar tipos de documentos en TipoDocumentoListComponent', error);
        }
      )
    );
  }

  eliminarTipoDocumento(marcaId: any) {
    this.tipoDocumentoService.deleteTipoDocumento(marcaId).subscribe(
      (response) => {
        this.loadTipoDocumentos();
        this.showSuccessAlert('Tipo de Documento eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Tipo de Documento: ' + error.error.message);
      }
    );
  }

  selectTipoDocumento(marcaId: number) {
    this.selectedTipoDocumentoId = marcaId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.tipos_documentos.length / this.itemsPerPage);
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

  paginatetipos_documentos(): TipoDocumento[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tipos_documentos.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.tipos_documentos = this.tipos_documentos.filter((tipo_documento) => {
        return (
          tipo_documento.tipo_documento_id.toString().includes(this.searchTerm) ||
          tipo_documento.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadTipoDocumentos();
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
