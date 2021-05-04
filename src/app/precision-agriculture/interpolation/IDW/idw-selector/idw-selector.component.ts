import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

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

  dataSource = new MatTableDataSource<InterpolatorSelectorResult>();
  displayedColumns = ['expoente', 'vizinho', 'isi', 'selecionar'];
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
      const fiveBest = this.getFiveBestIDWExponents(JSON.parse(JSON.stringify(result)).body);
      this.convertResult(fiveBest);
    }, err => {
      this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2500);
      this.loadBarState = 'none';
    });
  }

  getFiveBestIDWExponents(exponentResearch: any): any {
    const fiveBestExponent: any[] = [];
    for (let i = 0; i < 5; i++) {
      fiveBestExponent.push(exponentResearch[i]);
    }
    let aux: any;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        if (fiveBestExponent[j].isi > fiveBestExponent[j + 1].isi) {
          aux = fiveBestExponent[j];
          fiveBestExponent[j] = fiveBestExponent[j + 1];
          fiveBestExponent[j + 1] = aux;
        }
      }
    }
    let count: number;
    for (let i = 5; i < exponentResearch.length; i++) {
      if (exponentResearch[i].isi < fiveBestExponent[4].isi) {
        count = 0;
        for (let j = 3; j === 0; j--) {
          if (exponentResearch[i].isi < fiveBestExponent[j].isi) {
            count = count + 1;
          }
        }
        fiveBestExponent[4] = exponentResearch[i];
        for (let k = 3; k > (3 - count); k--) {
          aux = fiveBestExponent[k + 1];
          fiveBestExponent[k + 1] = fiveBestExponent[k];
          fiveBestExponent[k] = aux;
        }
      }
    }
    return fiveBestExponent;
  }

  convertResult(result: any): void {
    const tableContent: InterpolatorSelectorResult[] = [
      {exponent: result[0].exponent, neighbor: result[0].neighbors, isi: result[0].isi.toFixed(2)},
      {exponent: result[1].exponent, neighbor: result[1].neighbors, isi: result[1].isi.toFixed(2)},
      {exponent: result[2].exponent, neighbor: result[2].neighbors, isi: result[2].isi.toFixed(2)},
      {exponent: result[3].exponent, neighbor: result[3].neighbors, isi: result[3].isi.toFixed(2)},
      {exponent: result[4].exponent, neighbor: result[4].neighbors, isi: result[4].isi.toFixed(2)}
    ];
    this.dataSource.data = tableContent;
    this.researched = 1;
  }

  selectExponent(index: number): void {
    const selectedExponent = this.dataSource.data[index].exponent;
    this.selectorDialogRef.close({
      data: selectedExponent
    });
  }

}
