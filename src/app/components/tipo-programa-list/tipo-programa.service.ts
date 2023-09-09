import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TipoPrograma } from "../../models/tipo_programa.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoProgramaService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private tipoProgramaSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getTipoProgramaSubject(): Observable<void> {
    return this.tipoProgramaSubject.asObservable();
  }

  getTipoProgramas(): Observable<TipoPrograma[]> {
    return this.http
      .get<TipoPrograma[]>(`${this.apiUrl}/tipo_programas`, { headers: this.headers });
  }

  updateTipoProgramaData(tipo_programaId: number, tipo_programa_Data: any): Observable<any> {
    const url = `${this.apiUrl}/tipo_programas/${tipo_programaId}`;

    return this.http.put(url, tipo_programa_Data, { headers: this.headers });
  }

  createTipoProgramaData(tipo_programa_Data: any): Observable<any> {
    const url = `${this.apiUrl}/tipo_programas`;

    return this.http.post(url, tipo_programa_Data, { headers: this.headers });
  }

  getTipoProgramaById(tipo_programa_Id: number): Observable<TipoPrograma> {
    const url = `${this.apiUrl}/tipo_programas/${tipo_programa_Id}`;

    return this.http.get<TipoPrograma>(url, { headers: this.headers });
  }

  deleteTipoPrograma(tipo_programa_Id: number): Observable<any> {
    const url = `${this.apiUrl}/tipo_programas/${tipo_programa_Id}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.tipoProgramaSubject.next();
  }

}
