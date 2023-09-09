import { Component, OnInit, OnDestroy } from '@angular/core';
import { Modulo } from "../../models/modulo.model";
import { ModuloService } from './modulo.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-modulo-list',
  templateUrl: './modulo-list.component.html',
  styleUrls: ['./modulo-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ModuloListComponent implements OnInit, OnDestroy {

  modulos: Modulo[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedModuloId: number | null = null;
  selectedModuloState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private moduloService: ModuloService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadModulos();

    // Suscríbete al Subject para detectar cambios en los datos
    this.moduloService.getModuloSubject().subscribe(() => {
      this.loadModulos(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadModulos() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.moduloService.getModulos().subscribe(
        (data: any[]) => {
          this.modulos = data;
          //console.log(this.usuarios);
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar usuarios en UsuarioListComponent', error);
        }
      )
    );
  }

  updateEstado(estado: boolean, id: any) {

    this.moduloService.updateModuloEstado(id, estado).subscribe(
      (response) => {
        this.loadModulos();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarModulo(moduloId: any) {
    this.moduloService.deleteModulo(moduloId).subscribe(
      (response) => {
        this.loadModulos();
        this.showSuccessAlert('Modulo eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el modulo: ' + error.error.message);
      }
    );
  }

  selectModulo(moduloId: number, estado: boolean) {
    this.selectedModuloId = moduloId;
    this.selectedModuloState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.modulos.length / this.itemsPerPage);
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

  paginateModulos(): Modulo[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.modulos.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.modulos = this.modulos.filter((modulos) => {
        return (
          modulos.modulo_id.toString().includes(this.searchTerm) ||
          modulos.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          modulos.abreviacion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadModulos();
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
