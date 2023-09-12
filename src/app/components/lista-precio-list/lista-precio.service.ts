import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ListaPrecio, ListaPrecioVista } from "../../models/lista_precio.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaPrecioService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private lista_precioSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getlista_precioSubject(): Observable<void> {
    return this.lista_precioSubject.asObservable();
  }

  getListasPrecios(): Observable<ListaPrecioVista[]> {
    return this.http
      .get<ListaPrecioVista[]>(`${this.apiUrl}/listas_precios`, { headers: this.headers });
  }

  updateListaPrecioData(lista_precioId: number, listasPreciosData: any): Observable<any> {
    const url = `${this.apiUrl}/listas_precios/${lista_precioId}`;

    return this.http.put(url, listasPreciosData, { headers: this.headers });
  }

  createListaPrecioData(listasPreciosData: any): Observable<any> {
    const url = `${this.apiUrl}/listas_precios`;

    return this.http.post(url, listasPreciosData, { headers: this.headers });
  }

  getListaPrecioById(lista_precioId: number): Observable<ListaPrecio> {
    const url = `${this.apiUrl}/listas_precios/${lista_precioId}`;

    return this.http.get<ListaPrecio>(url, { headers: this.headers });
  }

  deleteListaPrecio(lista_precioId: number): Observable<any> {
    const url = `${this.apiUrl}/listas_precios/${lista_precioId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.lista_precioSubject.next();
  }
}
