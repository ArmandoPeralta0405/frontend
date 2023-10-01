import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TipoDocumento } from "../../models/tipo_documento.model";
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private apiUrl = environment.apiUrl; // Ajusta la URL de la API según tu proyecto
  private headers: HttpHeaders;

  private tipo_documentoSubject = new Subject<void>(); // Agrega un Subject para notificar cambios

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Configura los encabezados una vez en el constructor
    const token = this.authService.getToken();
    this.headers = new HttpHeaders().set('x-auth-token', `${token}`);
  }

  // Agrega una función para obtener el Subject
  getTipoDocumentoSubject(): Observable<void> {
    return this.tipo_documentoSubject.asObservable();
  }

  getTipoDocumentos(): Observable<TipoDocumento[]> {
    return this.http
      .get<TipoDocumento[]>(`${this.apiUrl}/tipos_documentos`, { headers: this.headers });
  }

  updateTipoDocumentoData(TipoDocumentoId: number, tipos_documentosData: any): Observable<any> {
    const url = `${this.apiUrl}/tipos_documentos/${TipoDocumentoId}`;

    return this.http.put(url, tipos_documentosData, { headers: this.headers });
  }

  createTipoDocumentoData(tipos_documentosData: any): Observable<any> {
    const url = `${this.apiUrl}/tipos_documentos`;

    return this.http.post(url, tipos_documentosData, { headers: this.headers });
  }

  getTipoDocumentoById(tipos_documentosId: number): Observable<TipoDocumento> {
    const url = `${this.apiUrl}/tipos_documentos/${tipos_documentosId}`;

    return this.http.get<TipoDocumento>(url, { headers: this.headers });
  }

  deleteTipoDocumento(tipos_documentosId: number): Observable<any> {
    const url = `${this.apiUrl}/tipos_documentos/${tipos_documentosId}`;

    return this.http.delete(url, { headers: this.headers });
  }

  notifyDataChange() {
    this.tipo_documentoSubject.next();
  }
}
