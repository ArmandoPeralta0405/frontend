import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    $('[data-widget="treeview"]').Treeview('init');
    setTimeout(() => this.activeMenuRefresh(), 500);
    // Verifica si el usuario está autenticado al cargar la aplicación
    if (this.authService.isAuthenticated) {
      //this.router.navigate(['/dashboard']);
    }
  }

  activeMenuRefresh() {
    // Verifica si la función treeview está disponible antes de llamarla
    if ($.fn.treeview) {
      $('[data-widget="treeview"]').treeview('expandAll');
      $('[data-widget="treeview"]').treeview('activateAll');
    }
  }
}
