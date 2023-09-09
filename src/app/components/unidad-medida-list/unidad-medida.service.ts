import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UnidadMedida } from "../../models/unidad_medida.model";
import { environment } from 'src/environment';


@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private unidadMedidaSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getUnidadMedidaSubject(): Observable<void> {
    return this.unidadMedidaSubject.asObservable();
  }

  getUnidadesMedidas(): Observable<UnidadMedida[]> {
    return this.http
      .get<UnidadMedida[]>(`${this.apiUrl}/unidades_medidas`, { headers: this.headers });
  }

  updateUnidadMedidaData(unidad_medidaId: number, unidadMedidaData: any): Observable<any> {
    const url = `${this.apiUrl}/unidades_medidas/${unidad_medidaId}`;

    return this.http.put(url, unidadMedidaData, { headers: this.headers });
  }

  createUnidadMedidaData(unidadMedidaData: any): Observable<any> {
    const url = `${this.apiUrl}/unidades_medidas`;

    return this.http.post(url, unidadMedidaData, { headers: this.headers });
  }

  getUnidadMedidaById(unidad_medidaId: number): Observable<UnidadMedida> {
    const url = `${this.apiUrl}/unidades_medidas/${unidad_medidaId}`;

    return this.http.get<UnidadMedida>(url, { headers: this.headers });
  }

  deleteunidadMedida(unidad_medidaId: number): Observable<any> {
    const url = `${this.apiUrl}/unidades_medidas/${unidad_medidaId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.unidadMedidaSubject.next();
  }
}
