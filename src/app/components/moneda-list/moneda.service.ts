import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Moneda } from "../../models/moneda.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private monedaSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getmonedaSubject(): Observable<void> {
    return this.monedaSubject.asObservable();
  }

  getMonedas(): Observable<Moneda[]> {
    return this.http
      .get<Moneda[]>(`${this.apiUrl}/monedas`, { headers: this.headers });
  }

  updateMonedaData(monedaId: number, monedaData: any): Observable<any> {
    const url = `${this.apiUrl}/monedas/${monedaId}`;

    return this.http.put(url, monedaData, { headers: this.headers });
  }

  createMonedaData(monedaData: any): Observable<any> {
    const url = `${this.apiUrl}/monedas`;

    return this.http.post(url, monedaData, { headers: this.headers });
  }

  getMonedaById(unidad_medidaId: number): Observable<Moneda> {
    const url = `${this.apiUrl}/monedas/${unidad_medidaId}`;

    return this.http.get<Moneda>(url, { headers: this.headers });
  }

  deleteMoneda(monedaId: number): Observable<any> {
    const url = `${this.apiUrl}/monedas/${monedaId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.monedaSubject.next();
  }
}
