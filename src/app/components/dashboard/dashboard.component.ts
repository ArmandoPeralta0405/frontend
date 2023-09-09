import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environment.prod';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $('[data-widget="treeview"]').Treeview('init');
    setTimeout(() => this.activeMenuRefresh(), 500);
  }

  activeMenuRefresh() {
    // Verifica si la función treeview está disponible antes de llamarla
    if ($.fn.treeview) {
      $('[data-widget="treeview"]').treeview('expandAll');
      $('[data-widget="treeview"]').treeview('activateAll');
    }
  }
}
