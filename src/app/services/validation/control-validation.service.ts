import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ControlValidationService {

  static integerValidation(): ValidatorFn {
    return (c: AbstractControl): {[key: string]: string} | null => {
      if (parseFloat(String(c.value)) === parseInt(String(c.value), 10)) {
        return null;
      } else {
        return { decimalError: 'The input is decimal and not integer.' };
      }
    };
  }

  constructor() { }
}
