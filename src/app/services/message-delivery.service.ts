import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessageDeliveryService {

  constructor(private router: Router,
              private snackBar: MatSnackBar) { }

  showMessage(message: string, timeOnScreen: number): void {
    this.snackBar.open(message, '', {
      duration: timeOnScreen,
      verticalPosition: 'top'
    });
  }

  showMessageWithButtonRoute(message: string, buttonLabel: string, path: string): void {
    this.snackBar.open(message, buttonLabel, {
      duration: 3000,
      verticalPosition: 'top'
    // tslint:disable-next-line: deprecation
    }).afterDismissed().subscribe(info => {
      if (info.dismissedByAction === true) {
        this.router.navigateByUrl(path);
      }
    });
  }
}
