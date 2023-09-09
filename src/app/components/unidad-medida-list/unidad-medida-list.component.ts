import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnidadMedida } from "../../models/unidad_medida.model";
import { UnidadMedidaService } from './unidad-medida.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-unidad-medida-list',
  templateUrl: './unidad-medida-list.component.html',
  styleUrls: ['./unidad-medida-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UnidadMedidaListComponent implements OnInit, OnDestroy {

  unidades_medidas: UnidadMedida[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedUnidadMedidaId: number | null = null;
  selectedunidades_medidaState: boolean = false;

  private destroy$: Subscription = new Subscription();


  constructor(
    private unidadmMedidaService: UnidadMedidaService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadUnidadesMedidas();

    // Suscríbete al Subject para detectar cambios en los datos
    this.unidadmMedidaService.getUnidadMedidaSubject().subscribe(() => {
      this.loadUnidadesMedidas(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadUnidadesMedidas() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.unidadmMedidaService.getUnidadesMedidas().subscribe(
        (data: any[]) => {
          this.unidades_medidas = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar Unidades de medida en UnidadMedidaListComponent', error);
        }
      )
    );
  }

  eliminarUnidadMedida(UnidadMedidaId: any) {
    this.unidadmMedidaService.deleteunidadMedida(UnidadMedidaId).subscribe(
      (response) => {
        this.loadUnidadesMedidas();
        this.showSuccessAlert('Unidad Medida eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el Unidad Medida: ' + error.error.message);
      }
    );
  }

  selectUnidadMedida(UnidadMedidaId: number, estado: boolean) {
    this.selectedUnidadMedidaId = UnidadMedidaId;
    this.selectedunidades_medidaState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.unidades_medidas.length / this.itemsPerPage);
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

  paginateunidades_medidas(): UnidadMedida[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.unidades_medidas.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.unidades_medidas = this.unidades_medidas.filter((unidades_medidas) => {
        return (
          unidades_medidas.unidad_medida_id.toString().includes(this.searchTerm) ||
          unidades_medidas.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          unidades_medidas.abreviacion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadUnidadesMedidas();
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
