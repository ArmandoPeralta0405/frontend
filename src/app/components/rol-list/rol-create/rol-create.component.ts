import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Rol } from "../../../models/rol.model";
import { RolService } from '../rol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environment.prod';

declare var $: any;

@Component({
  selector: 'app-rol-create',
  templateUrl: './rol-create.component.html',
  styleUrls: ['./rol-create.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate(environment.tiempoAnimacion, style({ opacity: 1 }))]),
      transition(':leave', [animate(environment.tiempoAnimacion, style({ opacity: 0 }))]),
    ]),
  ],
})
export class RolCreateComponent implements OnDestroy {

  rolId: any;
  rolForm: FormGroup;
  roles: Rol[] = [];

  private subscription: Subscription;
  private destroy$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private rolService: RolService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.rolId = params['rolId'];
    });

    this.rolForm = this.fb.group({
      descripcion: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.rolForm.controls;
  }

  createRolData() {
    if (this.rolForm.invalid) {
      return;
    }

    const newRol: Rol = {
      rol_id: 0,
      descripcion: this.f['descripcion'].value
    };

    this.rolService.createRolData(newRol).subscribe(
      (response) => {
        this.router.navigate(['/dashboard/rol']);
        this.rolService.notifyDataChange();
        this.showSuccesAlert('Datos registrados correctamente');
      },
      (error) => {
        this.showErrorAlert('Error: ' + error.error.message);
      }
    );
  }

  isFieldInvalid(fieldName: string) {
    const control = this.rolForm.get(fieldName);
    return control && control.invalid && control.touched;
  }

  showErrorAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-danger',
      title: 'Error',
      subtitle: '',
      body: message
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }

  showSuccesAlert(message: string) {
    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Éxito',
      subtitle: '',
      body: message
    });

    setTimeout(() => {
      $('.toast').toast('hide');
    }, 5000);
  }
}
