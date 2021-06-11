import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { KrigingSelectorResult } from '../../../../classes/krigingSelectorResult';
import { Layer } from '../../../../classes/layer';

import { ControlValidationService } from '../../../../services/validation/control-validation.service';
import { LayerStorageService } from '../../../../services/layer-storage.service';
import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { ServerConnectionService } from '../../../server-connection.service';

import { SelectorResultsComponent } from '../selector-results/selector-results.component';
import { SaveServerResultsComponent } from '../../../save-server-results/save-server-results.component';
import { SemivariogramResultsComponent } from '../semivariogram-results/semivariogram-results.component';

@Component({
  selector: 'app-kriging',
  templateUrl: './kriging.component.html',
  styleUrls: ['./kriging.component.css']
})
export class KrigingComponent implements OnInit {
  @Input() selectedLayer!: Layer;

  krigingSelectorForm = new FormGroup({
    rangeIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100),
      ControlValidationService.integerValidation()]),
    partialSillIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100),
      ControlValidationService.integerValidation()]),
    cutoff: new FormControl({disabled: false, value: 10}, [Validators.min(10), Validators.max(100),
      ControlValidationService.integerValidation()]),
    pairs: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(50),
      ControlValidationService.integerValidation()]),
    amountLags: new FormControl({disabled: true, value: 5}, [Validators.min(5), Validators.max(15),
      ControlValidationService.integerValidation()]),
    selectedLagType: new FormControl({disabled: false, value: 'automatic'})
  });
  loadBarStateParameters = 'none';
  parametersWereSelected = false;

  krigingForm = new FormGroup({
    sizePixelX: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10),
      ControlValidationService.integerValidation()]),
    sizePixelY: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10),
      ControlValidationService.integerValidation()])
  });
  loadBarStateKriging = 'none';

  semivariogramForm = new FormGroup({
    xAxis: new FormControl({disabled: false, value: 'eixo x'}, [Validators.required]),
    yAxis: new FormControl({disabled: false, value: 'eixo y'}, [Validators.required]),
    semivariogramWidth: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000),
      ControlValidationService.integerValidation()]),
    semivariogramHeight: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000),
      ControlValidationService.integerValidation()])
  });
  loadBarStateSemivariogram = 'none';

  krigingSelectorResults: KrigingSelectorResult = new KrigingSelectorResult(1, 'dummy', 'values', 1, 1, 1);
  // The values above are placeholders, and used because this variable cannot be null on render time

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private matDialog: MatDialog,
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
    },
      error => {
        this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2400);
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
    this.krigingSelectorResults = ({isi: tableData.data.isi, method: tableData.data.method, model: tableData.data.model,
      nuggetEffect: tableData.data.nuggetEffect, range: tableData.data.range, partialSill: tableData.data.partialSill});
  }

  executeKrigingInterpolation(): void {
    this.loadBarStateKriging = 'block';
    const sizePixelX = this.krigingForm.get('sizePixelX')?.value;
    const sizePixelY = this.krigingForm.get('sizePixelY')?.value;
    this.serverConnection.consumeKrigingInterpolation(this.krigingSelectorResults.model, this.krigingSelectorResults.nuggetEffect,
     this.krigingSelectorResults.method, this.krigingSelectorResults.partialSill, this.krigingSelectorResults.partialSill,
     sizePixelX, sizePixelY).toPromise().then(result => {
      this.loadBarStateKriging = 'none';
      const serverResult  = JSON.parse(JSON.stringify(result)).body;
      const layerIndex = this.getSelectedLayerIndex();
      this.layerStorage.updateKrigingAdditionalData(sizePixelX, sizePixelY, this.krigingSelectorResults.model,
        this.krigingSelectorResults.method, this.krigingSelectorResults.partialSill, this.krigingSelectorResults.partialSill,
        layerIndex);
      this.saveServerResponse(layerIndex, serverResult);
    },
      error => {
        this.loadBarStateKriging = 'none';
        this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2400);
      });
  }

  getSelectedLayerIndex(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('layerIndex') as string);
  }

  saveServerResponse(layerIndex: number, serverResult: any): void {
    const saveResultsDialog = this.matDialog.open(SaveServerResultsComponent, {
      width: '350px',
      disableClose: true,
      data: { layerIndex, serverResult }
    });

    saveResultsDialog.afterClosed().subscribe(result => {
      // returns if a new layer was created or if the consults results were deleted
      let layerVisualizationPath = 'single-layer-mapping/';
      if (result.newLayerCreated === true) {
        const lastAddedLayerId = this.layerStorage.getNumberOfStoredLayers() - 1;
        layerVisualizationPath = layerVisualizationPath.concat(String(lastAddedLayerId));
      } else {
        layerVisualizationPath = layerVisualizationPath.concat(String(this.getSelectedLayerIndex()));
      }
      if (result.deleteResults === true) {
        this.messageDelivery.showMessage('Nenhum dado foi salvo.', 2100);
      } else {
        this.messageDelivery.showMessageWithButtonRoute('A layer foi retificada com sucesso.', 'Verificar mapa', layerVisualizationPath);
      }
    });
  }

  getSemivariogram(): void {
    this.loadBarStateSemivariogram = 'block';
    const xAxis = this.semivariogramForm.get('xAxis')?.value;
    const yAxis = this.semivariogramForm.get('yAxis')?.value;
    const semivariogramWidth = this.semivariogramForm.get('semivariogramWidth')?.value;
    const semivariogramHeight = this.semivariogramForm.get('semivariogramHeight')?.value;
    this.serverConnection.consumeSemivariogram(xAxis, yAxis, semivariogramWidth, semivariogramHeight, this.krigingSelectorResults.model,
      this.krigingSelectorResults.nuggetEffect, this.krigingSelectorResults.method, this.krigingSelectorResults.partialSill,
       this.krigingSelectorResults.range).toPromise().then(result => {
        this.showSemivariogramResults((result.body as Blob), xAxis);
    },
      error => {
        this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2400);
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
