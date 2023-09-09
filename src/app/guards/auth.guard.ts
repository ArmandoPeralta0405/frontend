import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getIsAuthenticated() && !this.authService.isTokenExpired()) {
      return true; // El usuario está autenticado y el token no ha caducado, permite la navegación
    } else {
      this.router.navigate(['/login']);
      return false; // El usuario no está autenticado o el token ha caducado, redirige al inicio de sesión
    }
  }
}
