import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { KrigingSelectorResult } from '../../../../classes/krigingSelectorResult';
import { Layer } from '../../../../classes/layer';

import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { ServerConnectionService } from '../../../server-connection.service';

import { SelectorResultsComponent } from '../selector-results/selector-results.component';
import { SemivariogramResultsComponent } from '../semivariogram-results/semivariogram-results.component';

@Component({
  selector: 'app-kriging',
  templateUrl: './kriging.component.html',
  styleUrls: ['./kriging.component.css']
})
export class KrigingComponent implements OnInit {
  @Input() selectedLayer!: Layer;

  krigingSelectorForm = new FormGroup({
    rangeIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100)]),
    partialSillIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100)]),
    cutoff: new FormControl({disabled: false, value: 10}, [Validators.min(10), Validators.max(100)]),
    pairs: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(50)]),
    amountLags: new FormControl({disabled: true, value: 5}, [Validators.min(5), Validators.max(15)]),
    selectedLagType: new FormControl({disabled: false, value: 'automatic'})
  });
  loadBarStateParameters = 'none';
  parametersWereSelected = false;

  krigingForm = new FormGroup({
    sizePixelX: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)]),
    sizePixelY: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)])
  });
  loadBarStateKriging = 'none';

  semivariogramForm = new FormGroup({
    xAxis: new FormControl({disabled: false, value: 'eixo x'}, [Validators.required]),
    yAxis: new FormControl({disabled: false, value: 'eixo y'}, [Validators.required]),
    semivariogramWidth: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000)]),
    semivariogramHeight: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000)])
  });
  loadBarStateSemivariogram = 'none';

  krigingSelectorResults: KrigingSelectorResult[] = [];

  constructor(private matDialog: MatDialog,
              private messageDelivery: MessageDeliveryService,
              private serverConnection: ServerConnectionService) { }

  ngOnInit(): void {
  }

  disableRadioInput(selectedInput: string): void {
    if (selectedInput !== this.krigingSelectorForm.get('selectedLagType')?.value) {
      if (this.krigingSelectorForm.get('amountLags')?.disabled === true) {
        this.krigingSelectorForm.get('amountLags')?.enable();
      } else {
        this.krigingSelectorForm.get('amountLags')?.disable();
      }
    }
  }

  executeInterpolatorSelector(stepper: MatStepper): void {
    this.loadBarStateParameters = 'block';
    let finalAmountLags = 0;
    if (this.krigingSelectorForm.get('selectedLagType')?.value !== 'automatic') {
      finalAmountLags = this.krigingSelectorForm.get('amountLags')?.value;
    }
    const cutoff = this.krigingSelectorForm.get('cutoff')?.value;
    const pairs = this.krigingSelectorForm.get('pairs')?.value;
    const rangeIntervals = this.krigingSelectorForm.get('rangeIntervals')?.value;
    const partialSillIntervals = this.krigingSelectorForm.get('partialSillIntervals')?.value;
    this.serverConnection.consumeKrigingInterpolationSelection(finalAmountLags, cutoff, pairs, rangeIntervals, partialSillIntervals,
      this.selectedLayer.dataset).toPromise().then(result => {
        this.loadBarStateParameters = 'none';
        this.parametersWereSelected = true;
        this.showSelectorResults(JSON.parse(JSON.stringify(result)).body, stepper);
      });
  }

  showSelectorResults(results: any, stepper: MatStepper): void {
    const selectorResultRef = this.matDialog.open(SelectorResultsComponent, {
      width: '1150px',
      disableClose: true,
      data: { results }
    });

    // tslint:disable-next-line: deprecation
    selectorResultRef.afterClosed().subscribe(selectedParameters => {
      this.addTableData(selectedParameters);
      stepper.next();
      this.messageDelivery.showMessage('Parâmetros escolhidos com sucesso.', 2500);
    });
  }

  addTableData(tableData: any): void {
    if (this.krigingSelectorResults.length === 1) {
      this.krigingSelectorResults.pop();
    }
    this.krigingSelectorResults.push({isi: tableData.data.isi, method: tableData.data.method, model: tableData.data.model,
      nuggetEffect: tableData.data.nuggetEffect, range: tableData.data.range, partialSill: tableData.data.partialSill});
  }

  executeKrigingInterpolation(): void {
    this.loadBarStateKriging = 'block';
    const sizePixelX = this.krigingForm.get('sizePixelX')?.value;
    const sizePixelY = this.krigingForm.get('sizePixelY')?.value;
    this.serverConnection.consumeKrigingInterpolation(this.krigingSelectorResults[0].model, this.krigingSelectorResults[0].nuggetEffect,
     this.krigingSelectorResults[0].method, this.krigingSelectorResults[0].range, this.krigingSelectorResults[0].partialSill,
     sizePixelX, sizePixelY).toPromise().then(result => {
      this.loadBarStateKriging = 'none';
    });
  }

  getSemivariogram(): void {
    this.loadBarStateSemivariogram = 'block';
    const xAxis = this.semivariogramForm.get('xAxis')?.value;
    const yAxis = this.semivariogramForm.get('yAxis')?.value;
    const semivariogramWidth = this.semivariogramForm.get('semivariogramWidth')?.value;
    const semivariogramHeight = this.semivariogramForm.get('semivariogramHeight')?.value;
    this.serverConnection.consumeSemivariogram(xAxis, yAxis, semivariogramWidth, semivariogramHeight, this.krigingSelectorResults[0].model,
      this.krigingSelectorResults[0].nuggetEffect, this.krigingSelectorResults[0].method, this.krigingSelectorResults[0].partialSill,
      this.krigingSelectorResults[0].range).toPromise().then(result => {
        this.showSemivariogramResults((result.body as Blob), xAxis);
      });
  }

  showSemivariogramResults(semivariogramImage: Blob, graphicWidth: number): void {
    const dialogWidth = (graphicWidth + 100).toString();
    this.loadBarStateSemivariogram = 'none';
    const semivariogramResultRef = this.matDialog.open(SemivariogramResultsComponent, {
      width: dialogWidth,
      data: { semivariogramImage }
    });
  }
}
