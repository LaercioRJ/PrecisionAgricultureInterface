import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Layer } from '../../classes/layer';

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
        this.createNewLayer(this.data.newLayer);
        if (this.deleteLayerAfterEdit === true) {
          this.layerStorage.deleteLayer(this.data.layerIndex);
        }
        newLayerCreated = true;
        break;
      case 'Sobrescrever layer atual.':
        this.overwriteOriginalLayer(this.data.newLayer);
        break;
    }
    this.dialogReference.close({
      newLayerCreated, deleteResults
    });
  }

  overwriteOriginalLayer(newLayerData: Layer): void {
    const substitutelayer = this.atributeNewDataset(newLayerData);
    this.layerStorage.updateLayer(this.data.layerIndex, substitutelayer);
  }

  createNewLayer(newLayerData: Layer): void {
    const newLayer = this.atributeNewDataset(newLayerData);
    const newLayerName = this.newLayerName.value;
    newLayer.name = newLayerName;
    this.layerStorage.storeLayer(newLayer);
  }

  atributeNewDataset(newLayer: Layer): Layer {
    const dataset = this.serverDataConvertion.responseToDataset(this.data.serverResult);
    newLayer.dataset = dataset;
    newLayer.datasetLength = dataset.length;
    return newLayer;
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
