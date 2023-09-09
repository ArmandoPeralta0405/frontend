import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Usuario } from "../../models/usuario.model";
import { AuthService } from "../../auth/auth.service";
import { Subject } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private usuarioSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getUsuarioSubject(): Observable<void> {
    return this.usuarioSubject.asObservable();
  }

  getUsers(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.apiUrl}/usuarios`, { headers: this.headers });
  }

  updateUserEstado(usuarioId: number, nuevoEstado: boolean): Observable<any> {
    const url = `${this.apiUrl}/usuarios/estado/${usuarioId}`;
    const body = { estado: nuevoEstado };

    return this.http.put(url, body, { headers: this.headers });
  }

  updateUserData(usuarioId: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/${usuarioId}`;

    return this.http.put(url, userData, { headers: this.headers });
  }

  createUserData(userData: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios`;

    return this.http.post(url, userData, { headers: this.headers });
  }

  getUserById(usuarioId: number): Observable<Usuario> {
    const url = `${this.apiUrl}/usuarios/${usuarioId}`;

    return this.http.get<Usuario>(url, { headers: this.headers });
  }

  deleteUser(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}/usuarios/${usuarioId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.usuarioSubject.next();
  }
}
