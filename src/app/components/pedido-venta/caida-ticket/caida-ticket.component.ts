import { Component } from '@angular/core';
import { PedidoVentaService } from '../pedido-venta.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-caida-ticket',
  templateUrl: './caida-ticket.component.html',
  styleUrls: ['./caida-ticket.component.css']
})
export class CaidaTicketComponent {

  p_moneda: any;
  p_lista_precio: any;
  p_observacion: any;
  p_detalles: any = [];

  pedidoVentaId: any;

  pedidoVenta: any = [];

  private subscription: Subscription = new Subscription;

  constructor(
    private pedidoVentaService: PedidoVentaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.subscription = this.route.params.subscribe(params => {
      this.pedidoVentaId = +params['id'];

      // Llama a la función para obtener los datos del rol por ID
      this.loadPedidoVenta();
    });
  }

  loadPedidoVenta() {
    this.pedidoVentaService.obtenerDatosPedidoVentas(this.pedidoVentaId).subscribe(
      (response) => {
        this.pedidoVenta = response;
        console.log(this.pedidoVenta);
      }
    )
  }

  formatearValor(valor: any, monedaId: number): string {
    // Convierte el valor a un número si es una cadena
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (!isNaN(valorNumerico) && typeof monedaId !== 'undefined') {
      if (monedaId === 1) {
        // Moneda 1: Sin decimales y con separador de miles
        return valorNumerico.toLocaleString('es-ES', { minimumFractionDigits: 0, useGrouping: true });
      } else {
        // Otras monedas: 3 decimales y con separador de miles
        return valorNumerico.toLocaleString('es-ES', { minimumFractionDigits: 3, useGrouping: true });
      }
    } else {
      // Manejar el caso en el que valor no sea válido o monedaId sea undefined
      return 'Valor no válido';
    }
  }

  formatearFechaYHora(fechaHora: string): string {
    const fecha = new Date(fechaHora);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const ampm = horas >= '12' ? 'PM' : 'AM';
    const hora12 = (parseInt(horas) % 12).toString() || '12';

    return `${dia}/${mes}/${anio} ${hora12}:${minutos}:${segundos} ${ampm}`;
  }

}
