import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Modulo } from "../../models/modulo.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private moduloSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getModuloSubject(): Observable<void> {
    return this.moduloSubject.asObservable();
  }

  getModulos(): Observable<Modulo[]> {
    return this.http
      .get<Modulo[]>(`${this.apiUrl}/modulos`, { headers: this.headers });
  }

  updateModuloData(moduloId: number, moduloData: any): Observable<any> {
    const url = `${this.apiUrl}/modulos/${moduloId}`;

    return this.http.put(url, moduloData, { headers: this.headers });
  }

  createModuloData(moduloData: any): Observable<any> {
    const url = `${this.apiUrl}/modulos`;

    return this.http.post(url, moduloData, { headers: this.headers });
  }

  getModuloById(moduloId: number): Observable<Modulo> {
    const url = `${this.apiUrl}/modulos/${moduloId}`;

    return this.http.get<Modulo>(url, { headers: this.headers });
  }

  deleteModulo(moduloId: number): Observable<any> {
    const url = `${this.apiUrl}/modulos/${moduloId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.moduloSubject.next();
  }

  updateModuloEstado(moduloId: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.apiUrl}/modulos/estado/${moduloId}`;
    const body = { estado: nuevoEstado };

    return this.http.put(url, body, { headers: this.headers });
  }
}
