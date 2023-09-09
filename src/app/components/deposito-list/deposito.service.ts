import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Deposito } from "../../models/deposito.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private depositoSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getDepositoSubject(): Observable<void> {
    return this.depositoSubject.asObservable();
  }

  getDepositos(): Observable<Deposito[]> {
    return this.http
      .get<Deposito[]>(`${this.apiUrl}/depositos`, { headers: this.headers });
  }

  updateDepositoData(depositoId: number, depositosData: any): Observable<any> {
    const url = `${this.apiUrl}/depositos/${depositoId}`;

    return this.http.put(url, depositosData, { headers: this.headers });
  }

  createDepositoData(depositosData: any): Observable<any> {
    const url = `${this.apiUrl}/depositos`;

    return this.http.post(url, depositosData, { headers: this.headers });
  }

  getDepositoById(depositosId: number): Observable<Deposito> {
    const url = `${this.apiUrl}/depositos/${depositosId}`;

    return this.http.get<Deposito>(url, { headers: this.headers });
  }

  deleteDeposito(depositosId: number): Observable<any> {
    const url = `${this.apiUrl}/depositos/${depositosId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.depositoSubject.next();
  }
}
