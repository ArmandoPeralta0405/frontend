import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Articulo, ArticuloVista } from "../../models/articulo.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private articuloSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getarticuloSubject(): Observable<void> {
    return this.articuloSubject.asObservable();
  }

  getArticulos(): Observable<ArticuloVista[]> {
    return this.http
      .get<ArticuloVista[]>(`${this.apiUrl}/articulos`, { headers: this.headers });
  }

  updateArticuloData(articuloId: number, articuloData: any): Observable<any> {
    const url = `${this.apiUrl}/articulos/${articuloId}`;

    return this.http.put(url, articuloData, { headers: this.headers });
  }

  createarticuloData(articuloData: any): Observable<any> {
    const url = `${this.apiUrl}/articulos`;

    return this.http.post(url, articuloData, { headers: this.headers });
  }

  getArticuloById(articuloId: number): Observable<Articulo> {
    const url = `${this.apiUrl}/articulos/${articuloId}`;

    return this.http.get<Articulo>(url, { headers: this.headers });
  }

  deleteArticulo(articuloId: number): Observable<any> {
    const url = `${this.apiUrl}/articulos/${articuloId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.articuloSubject.next();
  }

  updateArticuloEstado(articuloId: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.apiUrl}/articulos/estado/${articuloId}`;
    const body = { estado: nuevoEstado };

    return this.http.put(url, body, { headers: this.headers });
  }
}
