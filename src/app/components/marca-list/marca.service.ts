import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Marca } from "../../models/marca.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private marcaSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getMarcaSubject(): Observable<void> {
    return this.marcaSubject.asObservable();
  }

  getMarcas(): Observable<Marca[]> {
    return this.http
      .get<Marca[]>(`${this.apiUrl}/marcas`, { headers: this.headers });
  }

  updateMarcaData(MarcaId: number, marcasData: any): Observable<any> {
    const url = `${this.apiUrl}/marcas/${MarcaId}`;

    return this.http.put(url, marcasData, { headers: this.headers });
  }

  createMarcaData(marcasData: any): Observable<any> {
    const url = `${this.apiUrl}/marcas`;

    return this.http.post(url, marcasData, { headers: this.headers });
  }

  getMarcaById(marcasId: number): Observable<Marca> {
    const url = `${this.apiUrl}/marcas/${marcasId}`;

    return this.http.get<Marca>(url, { headers: this.headers });
  }

  deleteMarca(marcasId: number): Observable<any> {
    const url = `${this.apiUrl}/marcas/${marcasId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.marcaSubject.next();
  }
}
