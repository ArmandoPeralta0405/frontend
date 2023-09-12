import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusService {

  constructor() { }

  focusNext(inputId: string) {
    const nextInput = document.getElementById(inputId);
    if (nextInput) {
      nextInput.focus();
    }
  }
}
