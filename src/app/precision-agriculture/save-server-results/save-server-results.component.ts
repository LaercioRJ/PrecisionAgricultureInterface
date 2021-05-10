import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Layer } from '../../classes/layer';
import { SamplingLayer } from '../../classes/samplingLayer';
import { ZmLayer } from '../../classes/zmLayer';

import { LayerStorageService  } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';
import { ServerDataConvertionService } from '../server-data-convertion.service';

@Component({
  selector: 'app-save-server-results',
  templateUrl: './save-server-results.component.html',
  styleUrls: ['./save-server-results.component.css']
})
export class SaveServerResultsComponent implements OnInit {

  constructor(private dialogReference: MatDialogRef<SaveServerResultsComponent>,
              private layerStorage: LayerStorageService,
              private MessageDelivery: MessageDeliveryService,
              private serverDataConvertion: ServerDataConvertionService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  deleteLayerAfterEdit = false;
  newLayerName = new FormControl({value: null, disabled: true}, Validators.required);
  options: string[] = ['Descartar Alterações.', 'Criar uma nova layer.', 'Sobrescrever layer atual.'];
  selectedOption = 'Sobrescrever layer atual.';

  ngOnInit(): void {
  }

  chooseSavingOperation(): void {
    let newLayerCreated = false;
    let deleteResults = false;

    if ((this.selectedOption === this.options[1]) && (this.newLayerName.valid === false)) {
      this.MessageDelivery.showMessage('Por favor, dê um nome para a nova layer.', 2200);
      return;
    }
    switch (this.selectedOption) {
      case 'Descartar Alterações.':
        deleteResults = true;
        break;
      case 'Criar uma nova layer.':
        this.createNewLayer();
        if (this.deleteLayerAfterEdit === true) {
          this.layerStorage.deleteLayer(this.data.layerIndex);
        } else {
          this.layerStorage.deleteZmLayerAdditionalData(this.data.layerIndex);
        }
        newLayerCreated = true;
        break;
      case 'Sobrescrever layer atual.':
        this.overwriteOriginalLayer();
        break;
    }
    this.dialogReference.close({
      newLayerCreated, deleteResults
    });
  }

  overwriteOriginalLayer(): void {
    const dataset = this.serverDataConvertion.responseToDataset(this.data.serverResult);
    this.layerStorage.updateAllLayerDataset(this.data.layerIndex, dataset);
  }

  createNewLayer(): void {
    const dataset = this.serverDataConvertion.responseToDataset(this.data.serverResult);
    const oldLayer = this.layerStorage.getLayer(this.data.layerIndex);
    let newLayer;
    if (oldLayer instanceof SamplingLayer) {

    } else {
      const newLayerName = this.newLayerName.value;
      newLayer = new ZmLayer(newLayerName, oldLayer.latitudeHeader, oldLayer.longitudeHeader, oldLayer.dataHeader, dataset.length);
      newLayer.iterations = (oldLayer as ZmLayer).iterations;
      newLayer.kernelFormat = (oldLayer as ZmLayer).kernelFormat;
      newLayer.kernelSize = (oldLayer as ZmLayer).kernelSize;
      newLayer.rectificationMethod = (oldLayer as ZmLayer).rectificationMethod;
      newLayer.dataset = dataset;
      this.layerStorage.storeLayer(newLayer);
    }
  }

  enableLayerNameField(): void {
    if (this.selectedOption === 'Criar uma nova layer.') {
      if (this.newLayerName.enabled === false) {
        this.newLayerName.enable();
      }
    } else {
      this.newLayerName.disable();
    }
  }

}
