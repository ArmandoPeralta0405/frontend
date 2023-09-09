import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Impuesto } from "../../models/impuesto.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private ImpuestoSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getImpuestoSubject(): Observable<void> {
    return this.ImpuestoSubject.asObservable();
  }

  getImpuestos(): Observable<Impuesto[]> {
    return this.http
      .get<Impuesto[]>(`${this.apiUrl}/impuestos`, { headers: this.headers });
  }

  updateImpuestoData(ImpuestoId: number, ImpuestosData: any): Observable<any> {
    const url = `${this.apiUrl}/impuestos/${ImpuestoId}`;

    return this.http.put(url, ImpuestosData, { headers: this.headers });
  }

  createImpuestoData(ImpuestosData: any): Observable<any> {
    const url = `${this.apiUrl}/impuestos`;

    return this.http.post(url, ImpuestosData, { headers: this.headers });
  }

  getImpuestoById(ImpuestosId: number): Observable<Impuesto> {
    const url = `${this.apiUrl}/impuestos/${ImpuestosId}`;

    return this.http.get<Impuesto>(url, { headers: this.headers });
  }

  deleteImpuesto(ImpuestosId: number): Observable<any> {
    const url = `${this.apiUrl}/impuestos/${ImpuestosId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.ImpuestoSubject.next();
  }
}
