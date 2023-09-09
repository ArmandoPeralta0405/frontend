import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Rol } from "../../models/rol.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private rolSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getRolSubject(): Observable<void> {
    return this.rolSubject.asObservable();
  }

  getRoles(): Observable<Rol[]> {
    return this.http
      .get<Rol[]>(`${this.apiUrl}/roles`, { headers: this.headers });
  }

  updateRolData(rolId: number, rolData: any): Observable<any> {
    const url = `${this.apiUrl}/roles/${rolId}`;

    return this.http.put(url, rolData, { headers: this.headers });
  }

  createRolData(rolData: any): Observable<any> {
    const url = `${this.apiUrl}/roles`;

    return this.http.post(url, rolData, { headers: this.headers });
  }

  getRolById(rolId: number): Observable<Rol> {
    const url = `${this.apiUrl}/roles/${rolId}`;

    return this.http.get<Rol>(url, { headers: this.headers });
  }

  deleteRol(rolId: number): Observable<any> {
    const url = `${this.apiUrl}/roles/${rolId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.rolSubject.next();
  }
}
