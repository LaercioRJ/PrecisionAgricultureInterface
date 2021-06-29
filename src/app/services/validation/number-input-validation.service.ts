import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberInputValidationService {

  constructor() { }

  isInteger(value: number): boolean {
    if (parseFloat(String(value)) === parseInt(String(value), 10)) {
      return true;
    } else {
      return false;
    }
  }

  isWithinBounds(value: number, lowerBound: number, upperBound: number): boolean {
    if ((value >= lowerBound) && (value <= upperBound)) {
      return true;
    } else {
      return false;
    }
  }
}
