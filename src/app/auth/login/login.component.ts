import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

declare var $: any; // Declara la variable global $ para jQuery

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  clave = '';
  isLoading = false; // Variable para controlar la visibilidad del spinner
  errorMessage = ''; // Variable para almacenar mensajes de error del backend

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {

    this.isLoading = true; // Activar el spinner al enviar el formulario
    this.authService.login(this.email, this.clave).subscribe(
      (response) => {
        // Activa la alerta de éxito de la plantilla
        this.showSuccessAlert(() => {
          // Redirige al usuario a la página deseada después de cerrar la alerta
          // Recarga la página para asegurarse de que se carguen correctamente los scripts y estilos
          this.router.navigate(['/dashboard/home']);
          this.isLoading = false; // Desactivar el spinner después de recibir una respuesta
        });
      },
      (error) => {
        console.log('ERROR: ' + error);
        // Mostrar el mensaje de error del backend en la alerta de error
        this.errorMessage = error; // Asigna el mensaje de error a la variable errorMessage
        this.showErrorAlert();
        this.isLoading = false; // Desactivar el spinner en caso de error
      }
    );
  }

  // Función para mostrar la alerta de éxito y ejecutar una función callback después de cerrarla
  showSuccessAlert(callback: () => void) {
    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Éxito',
      subtitle: '',
      body: 'Inicio de sesión exitoso.'
    });

    // Programa el cierre de la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
      $('.toast').toast('hide'); // Cierra la alerta
      callback(); // Llama a la función callback
    }, 3000);
  }

  // Función para mostrar la alerta de error
  showErrorAlert() {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: this.errorMessage // Mostrar el mensaje de error del backend
    });

    // Programa el cierre de la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
      $('.toast').toast('hide'); // Cierra la alerta
    }, 3000);
  }
}
