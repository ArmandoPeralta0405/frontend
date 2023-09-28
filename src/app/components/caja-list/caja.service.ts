import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Caja, CajaVista } from "../../models/caja.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private cajaSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getCajaSubject(): Observable<void> {
    return this.cajaSubject.asObservable();
  }

  getCajas(): Observable<CajaVista[]> {
    return this.http
      .get<CajaVista[]>(`${this.apiUrl}/cajas`, { headers: this.headers });
  }

  updateCajaData(cajaId: number, cajaData: any): Observable<any> {
    const url = `${this.apiUrl}/cajas/${cajaId}`;

    return this.http.put(url, cajaData, { headers: this.headers });
  }

  createCajaData(cajaData: any): Observable<any> {
    const url = `${this.apiUrl}/cajas`;

    return this.http.post(url, cajaData, { headers: this.headers });
  }

  getCajaById(cajaId: number): Observable<Caja> {
    const url = `${this.apiUrl}/cajas/${cajaId}`;

    return this.http.get<Caja>(url, { headers: this.headers });
  }

  deleteCaja(cajaId: number): Observable<any> {
    const url = `${this.apiUrl}/cajas/${cajaId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.cajaSubject.next();
  }

  updateCajaEstado(cajaId: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.apiUrl}/cajas/estado/${cajaId}`;
    const body = { estado: nuevoEstado };

    return this.http.put(url, body, { headers: this.headers });
  }
}
