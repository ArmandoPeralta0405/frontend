import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from "../../models/cliente.model";
import { ClienteService } from './cliente.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClienteListComponent implements OnInit, OnDestroy {

  originalClientes: Cliente[] = []; // Copia original de los datos
  clientes: Cliente[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchTerm: string = '';
  selectedClienteId: number | null = null;
  selectedClienteState: boolean = false;

  private destroy$: Subscription = new Subscription();

  constructor(
    private clienteService: ClienteService
  ) {
    this.searchTerm = '';
  }

  ngOnInit() {
    this.loadClientes();

    // Suscríbete al Subject para detectar cambios en los datos
    this.clienteService.getClienteSubject().subscribe(() => {
      this.loadClientes(); // Actualiza los datos cuando se emite un evento en el Subject
    });
  }

  ngOnDestroy() {
    // Limpia todas las suscripciones al destruir el componente
    this.destroy$.unsubscribe();
  }

  loadClientes() {
    // Cancela la suscripción anterior antes de realizar una nueva solicitud
    this.destroy$.add(
      this.clienteService.getClientes().subscribe(
        (data: any[]) => {
          this.originalClientes = data; // Almacena los datos originales
          this.clientes = data;
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error al cargar clientes en ClienteListComponent', error);
        }
      )
    );
  }

  updateEstado(estado: boolean, id: any) {

    this.clienteService.updateClienteEstado(id, estado).subscribe(
      (response) => {
        this.loadClientes();
      },
      (error) => {
        this.showErrorAlert('Error al actualizar el estado: ' + error);
      }
    );
  }

  eliminarCliente(clienteId: any) {
    this.clienteService.deleteCliente(clienteId).subscribe(
      (response) => {
        this.loadClientes();
        this.showSuccessAlert('Cliente eliminado con éxito');
      },
      (error) => {
        this.showErrorAlert('Error al eliminar el cliente: ' + error.error.message);
      }
    );
  }

  selectCliente(clienteId: number, estado: boolean) {
    this.selectedClienteId = clienteId;
    this.selectedClienteState = estado;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.clientes.length / this.itemsPerPage);
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

  paginateCliente(): Cliente[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.clientes.slice(startIndex, endIndex);
  }

  filtrosTabla() {
    if (this.searchTerm !== null && this.searchTerm !== undefined) {
      // Aplica el filtro solo a la copia original de los datos
      this.clientes = this.originalClientes.filter((cliente) => {
        return (
          cliente.cliente_id.toString().includes(this.searchTerm) ||
          cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          cliente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          cliente.cedula.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (cliente.telefono && cliente.telefono.toLowerCase().includes(this.searchTerm.toLowerCase())) // Verifica si 'telefono' no es nulo o indefinido
        );
      });
      this.calculateTotalPages();
      this.currentPage = 1;
    } else {
      // Si searchTerm es null o undefined, carga todos los clientes nuevamente desde la copia original
      this.clientes = [...this.originalClientes];
      this.calculateTotalPages();
      this.currentPage = 1;
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
