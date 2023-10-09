import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timbrado, TimbradoVista } from "../../models/timbrado.model";
import { TimbradoService } from './timbrado.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-timbrado-list',
  templateUrl: './timbrado-list.component.html',
  styleUrls: ['./timbrado-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
  providers: [DatePipe],
})
export class TimbradoListComponent implements OnInit, OnDestroy {

  timbrados: TimbradoVista[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedTimbradoId: number | null = null;
  selectedTimbradoState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private timbradoService: TimbradoService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadTimbrados();

    // Suscríbete al Subject para detectar cambios en los datos
    this.timbradoService.getTimbradoSubject().subscribe(() => {
      this.loadTimbrados(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadTimbrados() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.timbradoService.getTimbrados().subscribe(
        (data: any[]) => {
          this.timbrados = data;
          //console.log(this.timbrados);
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar timbrados en TimbradoListComponent', error);
        }
      )
    );
  }

  updateEstado(estado: boolean, id: any) {

    this.timbradoService.updateTimbradoEstado(id, estado).subscribe(
      (response) => {
        this.loadTimbrados();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarTimbrado(cajaId: any) {
    this.timbradoService.deleteTimbrado(cajaId).subscribe(
      (response) => {
        this.loadTimbrados();
        this.showSuccessAlert('Timbrado eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el caja: ' + error.error.message);
      }
    );
  }

  selectTimbrado(cajaId: number, estado: boolean) {
    this.selectedTimbradoId = cajaId;
    this.selectedTimbradoState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.timbrados.length / this.itemsPerPage);
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

  paginateTimbrados(): TimbradoVista[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.timbrados.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.timbrados = this.timbrados.filter((timbrados) => {
        return (
          timbrados.timbrado_id.toString().includes(this.searchTerm) ||
          timbrados.numero.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.establecimiento.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.punto_emision.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.numero_inicial.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.numero_final.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.fecha_inicial?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          timbrados.fecha_final?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadTimbrados();
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

