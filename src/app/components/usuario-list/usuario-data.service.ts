import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDataService {
  private usuarioData = new Subject<void>();

  usuarioData$ = this.usuarioData.asObservable();

  triggerDataUpdate() {
    this.usuarioData.next();
  }
}
