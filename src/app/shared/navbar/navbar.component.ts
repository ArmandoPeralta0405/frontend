import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('900ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('900ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  onLogoutClick(): void {
    // Llama al método de cierre de sesión del servicio de autenticación
    this.authService.logout();
    // También puedes redirigir al usuario a la página de inicio de sesión si lo deseas
    this.router.navigate(['/login']);
  }

}
