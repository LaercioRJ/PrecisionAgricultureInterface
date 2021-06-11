import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Layer } from '../../classes/layer';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';
import { ServerConnectionService } from '../server-connection.service';

import { SaveServerResultsComponent } from '../save-server-results/save-server-results.component';

@Component({
  selector: 'app-rectification',
  templateUrl: './rectification.component.html',
  styleUrls: ['./rectification.component.css']
})
export class RectificationComponent implements OnInit {

  customIteration = 7;
  customIterationPreviousValue = 7;
  iterations: number[] = [1, 2, 3, 4, 5, 6];
  kernelFormats: string[] = ['Retangular', 'Elipse', 'Cruz'];
  kernelSizes: string[] = ['3X3', '5X5', '7X7', '9X9', '11X11'];
  rectificationMethods: string[] = ['Mediana', 'Aberto', 'Fechado', 'Aberto e Fechado'];
  selectedKernelFormat = 'Retangular';
  selectedKernelSize = '3X3';
  selectedIteration = 1;
  selectedRectificationMethod = 'Mediana';

  layer!: Layer;

  loadBarState = 'none';

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private matDialog: MatDialog,
              private messageDelivery: MessageDeliveryService,
              private serverConnection: ServerConnectionService) { }

  ngOnInit(): void {
    const layerIndex = this.getLayerIndex();
    this.layer = this.layerStorage.getLayer(Number(layerIndex));
  }

  getLayerIndex(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('layerIndex') as string);
  }

  validateIterationNumber(): void {
    const inputValue = this.customIteration;
    if ((parseFloat(String(inputValue)) === parseInt(String(inputValue), 10)) && inputValue > 6 && inputValue <= 25) {
      this.customIterationPreviousValue = this.customIteration;
    } else {
      if (!(parseFloat(String(inputValue)) === parseInt(String(inputValue), 10))) {
        this.messageDelivery.showMessage('Por favor, utilize apenas valores inteiros', 2100);
      } else {
        this.messageDelivery.showMessage('Por favor, utilize apenas valores entre 7 e 25', 2100);
      }
      this.customIteration = this.customIterationPreviousValue;
    }
  }

  executeRectification(): void {
    let kFormat = '';
    let kSize = 0;
    let rMethod = '';
    let iteration = 0;
    this.loadBarState = 'block';

    switch (this.selectedKernelFormat) {
      case 'Retangular':
        kFormat = 'rect';
        break;
      case 'Elipse':
        kFormat = 'ellipse';
        break;
      case 'Cruz':
        kFormat = 'cross';
        break;
    }

    switch (this.selectedKernelSize) {
      case '3X3':
        kSize = 3;
        break;
      case '5X5':
        kSize = 5;
        break;
      case '7X7':
        kSize = 7;
        break;
      case '9X9':
        kSize = 9;
        break;
      case '11X11':
        kSize = 11;
        break;
    }

    switch (this.selectedRectificationMethod) {
      case 'Mediana':
        rMethod = 'median';
        break;
      case 'Aberto':
        rMethod = 'open';
        break;
      case 'Fechado':
        rMethod = 'close';
        break;
      case 'Aberto e Fechado':
        rMethod = 'openandclose';
        break;
    }

    if (Number(this.selectedIteration) === 7) {
      iteration = this.customIteration;
    } else {
      iteration = Number(this.selectedIteration);
    }

    this.serverConnection.consumeRectification(kFormat, kSize, rMethod, iteration, this.layer.dataset).toPromise().then( result => {
      this.loadBarState = 'none';
      const serverResult  = JSON.parse(JSON.stringify(result)).body;
      this.layerStorage.updateZmLayerAdditionalData(this.getLayerIndex(), this.selectedRectificationMethod, kSize,
        this.selectedKernelFormat, iteration);
      this.saveServerResponse(this.getLayerIndex(), serverResult);
    },
      error => {
        this.loadBarState = 'none';
        this.messageDelivery.showMessage('Houve um problema ao acessar o servidor, por favor tente mais tarde.', 2400);
        throw new Error('Sem resposta do servidor.');
      });
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
        layerVisualizationPath = layerVisualizationPath.concat(String(this.getLayerIndex()));
      }
      if (result.deleteResults === true) {
        this.messageDelivery.showMessage('Nenhum dado foi salvo.', 2100);
      } else {
        this.messageDelivery.showMessageWithButtonRoute('A layer foi retificada com sucesso.', 'Verificar mapa', layerVisualizationPath);
      }
    });
  }

}

