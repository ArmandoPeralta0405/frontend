import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Timbrado, TimbradoVista } from "../../models/timbrado.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class TimbradoService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private timbradoSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getTimbradoSubject(): Observable<void> {
    return this.timbradoSubject.asObservable();
  }

  getTimbrados(): Observable<TimbradoVista[]> {
    return this.http
      .get<TimbradoVista[]>(`${this.apiUrl}/timbrados`, { headers: this.headers });
  }

  updateTimbradoData(timbradoId: number, timbradoData: any): Observable<any> {
    const url = `${this.apiUrl}/timbrados/${timbradoId}`;

    return this.http.put(url, timbradoData, { headers: this.headers });
  }

  createTimbradoData(timbradoData: any): Observable<any> {
    const url = `${this.apiUrl}/timbrados`;

    return this.http.post(url, timbradoData, { headers: this.headers });
  }

  getTimbradoById(timbradoId: number): Observable<Timbrado> {
    const url = `${this.apiUrl}/timbrados/${timbradoId}`;

    return this.http.get<Timbrado>(url, { headers: this.headers });
  }

  deleteTimbrado(timbradoId: number): Observable<any> {
    const url = `${this.apiUrl}/timbrados/${timbradoId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.timbradoSubject.next();
  }

  updateTimbradoEstado(timbradoId: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.apiUrl}/timbrados/estado/${timbradoId}`;
    const body = { estado: nuevoEstado };

    return this.http.put(url, body, { headers: this.headers });
  }
}

