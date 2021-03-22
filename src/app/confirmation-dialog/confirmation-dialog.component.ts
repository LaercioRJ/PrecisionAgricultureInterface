import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(private dialogReference: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  question = '';
  denyButton = '';
  acceptButton = '';

  ngOnInit(): void {
    this.question = this.data.message;
    this.denyButton = 'Cancelar';
    this.acceptButton = 'Excluir';
  }

  closeDialog(answer: number): void {
    /*answer = 0 => action rejected; answer = 1 => action accepted*/
    this.dialogReference.close({
      answer
    });
  }

}
