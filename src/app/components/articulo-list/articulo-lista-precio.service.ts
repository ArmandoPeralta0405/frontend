import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ArticuloListaPrecio, ArticuloListaPrecioVista } from "../../models/articulo_lista_precio.model";
import { environment } from 'src/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticuloListaPrecioService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private articuloListaPrecioSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

   // Agrega una función para obtener el Subject
   getArticuloListaPrecioSubject(): Observable<void> {
    return this.articuloListaPrecioSubject.asObservable();
  }

  getArticuloListaPrecioById(articuloId: number): Observable<ArticuloListaPrecioVista[]> {
    const url = `${this.apiUrl}/articulos_listas_precios/${articuloId}`;

    return this.http.get<ArticuloListaPrecioVista[]>(url, { headers: this.headers });
  }

  // Agrega una función para insertar o editar precio
  insertarEditarPrecio(articuloListaPrecio: ArticuloListaPrecio): Observable<void> {
    const url = `${this.apiUrl}/articulos_listas_precios/insertar_editar`;

    return this.http.post<void>(url, articuloListaPrecio, { headers: this.headers });
  }

  notifyDataChange() {
    this.articuloListaPrecioSubject.next();
  }

}
