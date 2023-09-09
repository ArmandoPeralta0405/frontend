import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private authTokenKey = 'authToken'; // Nombre clave para el token en localStorage
  public isAuthenticated = !!localStorage.getItem(this.authTokenKey); // Verifica la existencia del token

  constructor(
    private _http: HttpClient
  ) { }

  // Método para iniciar sesión y establecer isAuthenticated en true
  login(email: string, clave: string): Observable<any> {
    const body = { email, clave };

    return this._http.post(`${this.apiUrl}/login`, body)
      .pipe(
        tap((response: any) => {
          // Almacenar el token en localStorage
          localStorage.setItem(this.authTokenKey, response.token);
          // Establecer isAuthenticated en true
          this.setIsAuthenticated(true);
        }),
        catchError((error) => {

          // Aquí puedes manejar las respuestas de error desde el servidor
          if (error.status === 401) {
            // El servidor devuelve un error de autenticación no autorizada (por ejemplo, credenciales incorrectas)
            return throwError("error"+error.error.message);
          } else if (error.status === 500) {
            // El servidor devuelve un error interno del servidor
            return throwError("error"+error.error.message);
          } else {
            // Otros errores
            return throwError("error"+error.error.message);
          }
        })
      );
  }

  // Método para cerrar sesión y establecer isAuthenticated en false
  logout(): void {
    // Eliminar el token almacenado
    localStorage.removeItem(this.authTokenKey);
    // Establecer isAuthenticated en false
    this.setIsAuthenticated(false);
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Método para obtener el estado de autenticación
  getIsAuthenticated(): boolean {
    return this.isAuthenticated && !this.isTokenExpired(); // Verifica si el token ha caducado
  }

  // Método para establecer el estado de autenticación
  setIsAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }

  // Método para verificar si el token ha caducado
  isTokenExpired(): boolean {
    const authToken = this.getToken();
    if (!authToken) {
      return true; // El token no está presente
    }

    const tokenPayload = this.parseJwt(authToken);
    if (!tokenPayload || !tokenPayload.exp) {
      return true; // No se pudo obtener la fecha de expiración del token
    }

    const expirationDate = new Date(tokenPayload.exp * 1000); // Convertir a milisegundos
    const currentDate = new Date();

    return expirationDate <= currentDate; // Compara con la fecha actual
  }

  // Método para analizar un token JWT y devolver el contenido
  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error al analizar el token JWT', e);
      return null;
    }
  }

  // Método para obtener los datos del usuario del token
  getUsuarioFromToken(): any {
    const token = this.getToken();
    if (token) {
      const tokenPayload = this.parseJwt(token);
      if (tokenPayload) {
        return tokenPayload; // Devuelve los datos del usuario desde el token
      }
    }
    return null;
  }
}
