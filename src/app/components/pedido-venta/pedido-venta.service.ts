import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environment';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoVentaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  getNumeroPedidoDisponible(): Observable<number> {
    // Hacer una solicitud HTTP para obtener el número de pedido disponible
    return this.http.get<number>(`${this.apiUrl}/numero_disponible_pedido`, { headers: this.headers });
  }

  getObtenerPrecio(filtrosData: any): Observable<any> {
    const url = `${this.apiUrl}/obtener_precio`;

    return this.http.post(url, filtrosData, { headers: this.headers });
  }

  createPedidoVentaData(pedidoVentaData: any): Observable<any> {
    const url = `${this.apiUrl}/pedidos_ventas`;

    return this.http.post(url, pedidoVentaData, { headers: this.headers });
  }

  obtenerDatosPedidoVentas(pedido_venta_id: number): Observable<any> {
    const url = `${this.apiUrl}/pedidos_ventas_comprobantes/${pedido_venta_id}`;

    return this.http.get<any>(url, { headers: this.headers });
  }

}
