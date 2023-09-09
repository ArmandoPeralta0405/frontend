import { Component, OnInit, OnDestroy } from '@angular/core';
import { Rol } from "../../models/rol.model";
import { RolService } from './rol.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery


@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class RolListComponent implements OnInit, OnDestroy {

  roles: Rol[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedRolId: number | null = null;

  private destroy$: Subscription = new Subscription();

  constructor(
    private rolService: RolService,
    private authService: AuthService
  ) {
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.loadRoles();

    // Suscríbete al Subject para detectar cambios en los datos
    this.rolService.getRolSubject().subscribe(() => {
      this.loadRoles(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }
  ngOnDestroy(): void {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadRoles() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.rolService.getRoles().subscribe(
        (data: any[]) => {
          this.roles = data;
          //console.log(this.roles);
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar roles en RolListComponent', error);
        }
      )
    );
  }

  eliminarRol(rolId: any) {
    this.rolService.deleteRol(rolId).subscribe(
      (response) => {
        this.loadRoles();
        this.showSuccessAlert('Rol eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el rol: ' + error.error.message);
      }
    );
  }

  selectRol(rolId: number) {
    this.selectedRolId = rolId;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.roles.length / this.itemsPerPage);
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

  paginateRoles(): Rol[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.roles.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.roles = this.roles.filter((rol) => {
        return (
          rol.rol_id.toString().includes(this.searchTerm) ||
          rol.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadRoles();
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
