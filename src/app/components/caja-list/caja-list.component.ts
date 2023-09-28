import { Component, OnInit, OnDestroy } from '@angular/core';
import { Caja, CajaVista } from "../../models/caja.model";
import { CajaService } from './caja.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-caja-list',
  templateUrl: './caja-list.component.html',
  styleUrls: ['./caja-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class CajaListComponent implements OnInit, OnDestroy {

  cajas: CajaVista[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedCajaId: number | null = null;
  selectedCajaState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private cajaService: CajaService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadCajas();

    // Suscríbete al Subject para detectar cambios en los datos
    this.cajaService.getCajaSubject().subscribe(() => {
      this.loadCajas(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadCajas() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.cajaService.getCajas().subscribe(
        (data: any[]) => {
          this.cajas = data;
          //console.log(this.cajas);
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar cajas en UsuarioListComponent', error);
        }
      )
    );
  }

  updateEstado(estado: boolean, id: any) {

    this.cajaService.updateCajaEstado(id, estado).subscribe(
      (response) => {
        this.loadCajas();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarCaja(cajaId: any) {
    this.cajaService.deleteCaja(cajaId).subscribe(
      (response) => {
        this.loadCajas();
        this.showSuccessAlert('Caja eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el caja: ' + error.error.message);
      }
    );
  }

  selectCaja(cajaId: number, estado: boolean) {
    this.selectedCajaId = cajaId;
    this.selectedCajaState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.cajas.length / this.itemsPerPage);
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

  paginateCajas(): CajaVista[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.cajas.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.cajas = this.cajas.filter((cajas) => {
        return (
          cajas.caja_id.toString().includes(this.searchTerm) ||
          cajas.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadCajas();
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
