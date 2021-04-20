import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { ServerConnectionService } from '../../../server-connection.service';

import { Layer } from '../../../../classes/layer';

export interface InterpolatorSelectorResult {
  exponent: number;
  neighbor: number;
  isi: number;
}

@Component({
  selector: 'app-idw-selector',
  templateUrl: './idw-selector.component.html',
  styleUrls: ['./idw-selector.component.css']
})
export class IdwSelectorComponent implements OnInit {

  idwSelectorForm = new FormGroup({
    minExponent: new FormControl({disabled: false, value: 0.5}, [Validators.min(0.5), Validators.max(10)]),
    maxExponent: new FormControl({disabled: false, value: 6}, [Validators.min(0.5), Validators.max(10)]),
    minNeighbor: new FormControl({disabled: false, value: 7}, [Validators.min(1), Validators.max(50)]),
    maxNeighbor: new FormControl({disabled: false, value: 10}, [Validators.min(10), Validators.max(50)]),
    stepExponent: new FormControl({disabled: false, value: 0.5}, [Validators.min(0.5), Validators.max(10)])
  });
  layer = this.data.layer;
  loadBarState = 'none';
  researched = 0;

  constructor(private messageDelivery: MessageDeliveryService,
              private selectorDialogRef: MatDialogRef<IdwSelectorComponent>,
              private serverConnection: ServerConnectionService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.layer = this.data.layer;
  }

  closeDialog(): void {
    this.selectorDialogRef.close();
  }

  searchBestExponents(): void {
    const minExponent = this.idwSelectorForm.get('minExponent')?.value;
    const maxExponent = this.idwSelectorForm.get('maxExponent')?.value;
    const stepExponent = this.idwSelectorForm.get('stepExponent')?.value;
    const minNeighbor = this.idwSelectorForm.get('minNeighbor')?.value;
    const maxneighbor = this.idwSelectorForm.get('maxNeighbor')?.value;
    this.loadBarState = 'block';
    this.serverConnection.consumeIdwInterpolatorSelection(minExponent, maxExponent, stepExponent, minNeighbor, maxneighbor,
      this.layer.dataset).toPromise().then(result => {
        this.loadBarState = 'none';
      }, err => {
        this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2500);
        this.loadBarState = 'none';
      });
  }

}
