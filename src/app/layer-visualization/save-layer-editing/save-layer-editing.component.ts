import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Layer } from '../../classes/layer';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

@Component({
  selector: 'app-save-layer-editing',
  templateUrl: './save-layer-editing.component.html',
  styleUrls: ['./save-layer-editing.component.css']
})
export class SaveLayerEditingComponent implements OnInit {

  constructor(private dialogReference: MatDialogRef<SaveLayerEditingComponent>,
              private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  deleteLayerAfterEdit = false;
  newLayerName = new FormControl({value: null, disabled: true}, Validators.required);
  options: string [] = ['Descartar alterações.', 'Criar uma nova layer.', 'Sobrescrever layer atual.'];
  selectedOption = 'Sobrescrever layer atual.';

  ngOnInit(): void {
  }

  finishEditing(): void {
    let newLayerCreated = false;
    let deleteResults = false;

    switch (this.selectedOption) {
      case 'Descartar alterações.':
        this.messageDelivery.showMessage('Todas as alterações foram excluídas.', 2400);
        deleteResults = true;
        break;
      case 'Criar uma nova layer.':
        this.messageDelivery.showMessage('Nova layer criada com sucesso.', 2400);
        newLayerCreated = true;
        break;
      case 'Sobrescrever layer atual.':
        this.layerStorage.updateSomeDatasetPoints(this.data.layerIndex, this.data.newDataset, this.data.newPointsIndex);
        this.messageDelivery.showMessage('Todas as alterações foram salvas.', 2400);
        break;
    }
    this.dialogReference.close({
      newLayerCreated, deleteResults
    });
  }

  enableLayerField(): void {
    if (this.selectedOption === 'Criar uma nova layer.') {
      if (this.newLayerName.enabled === false) {
        this.newLayerName.enable();
      } else {
        this.newLayerName.disable();
      }
    }
  }

}
