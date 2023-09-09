import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from "../../models/usuario.model";
import { UsuarioService } from './usuario.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class UsuarioListComponent implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedUserId: number | null = null;
  selectedUserState: boolean = false;

  private destroy$: Subscription = new Subscription();

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadUsuarios();

    // Suscríbete al Subject para detectar cambios en los datos
    this.usuarioService.getUsuarioSubject().subscribe(() => {
      this.loadUsuarios(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }
  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadUsuarios() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.usuarioService.getUsers().subscribe(
        (data: any[]) => {
          this.usuarios = data;
          //console.log(this.usuarios);
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar usuarios en UsuarioListComponent', error);
        }
      )
    );
  }

  selectUser(usuarioId: number, estado: boolean) {
    this.selectedUserId = usuarioId;
    this.selectedUserState = estado;
  }

  updateEstado(estado: boolean, id: any) {

    // Obtén los datos del usuario logeado desde AuthService
    const usuarioLogeado = this.authService.getUsuarioFromToken();

    if (usuarioLogeado.user_id === id) {
      this.showErrorAlert('No puedes actualizar tu propio estado.');
      return;
    }

    this.usuarioService.updateUserEstado(id, estado).subscribe(
      (response) => {
        this.loadUsuarios();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarUsuario(usuarioId: any) {
    // Obtén los datos del usuario logeado desde AuthService
    const usuarioLogeado = this.authService.getUsuarioFromToken();

    if (usuarioLogeado.user_id === usuarioId) {
      this.showErrorAlert('No puedes eliminar al usuario que estas utilizando en la sesion.');
      return;
    }

    this.usuarioService.deleteUser(usuarioId).subscribe(
      (response) => {
        this.loadUsuarios();
        this.showSuccessAlert('Usuario eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el usuario: ' + error.error.message);
      }
    );
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.usuarios.length / this.itemsPerPage);
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

  paginateUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.usuarios.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm) {
      this.usuarios = this.usuarios.filter((usuario) => {
        return (
          usuario.usuario_id.toString().includes(this.searchTerm) ||
          usuario.alias.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          usuario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          usuario.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          usuario.cedula_identidad.includes(this.searchTerm)
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      this.loadUsuarios();
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
