import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntegerValidationService {

  constructor() { }

  isInteger(value: number): boolean {
    if (parseFloat(String(value)) === parseInt(String(value), 10)) {
      return true;
    } else {
      return false;
    }
  }
}
