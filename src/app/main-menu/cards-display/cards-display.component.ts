import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import { ContournImportingService } from '../../services/contourn-IO/contourn-importing.service';
import { ContournExportingService } from '../../services/contourn-IO/contourn-exporting.service';
import { LayerExportingService } from '../../services/layer-IO/layer-exporting.service';
import { LayerImportingService } from '../../services/layer-IO/layer-importing.service';
import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

import { Layer } from '../../classes/layer';
import { SamplingLayer } from '../../classes/samplingLayer';

import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html',
  styleUrls: ['./cards-display.component.css']
})
export class CardsDisplayComponent implements OnInit {

  constructor(private contournImporting: ContournImportingService,
              private contournExporting: ContournExportingService,
              private layerExporting: LayerExportingService,
              private layerImporting: LayerImportingService,
              private layerStorage: LayerStorageService,
              private matDialog: MatDialog,
              private messageDelivery: MessageDeliveryService) { }

  displayedLayers: Layer[] = [];
  selectedLayerIndex = -1;
  selectedLayerName = '';
  selectedLayerType = 0;
  hasContourn = false;
  /*Sampling Points Layer = 0; Management Zone Layer = 1 */

  ngOnInit(): void {
    this.displayedLayers = this.layerStorage.getLayers();
  }

  recieveLayerFile(event: any, layerType: number): void {
    if (event.target.files && event.target.files[0]) {
      this.layerImporting.fileToLayer(event.target.files[0], layerType);
      this.displayedLayers = this.layerStorage.getLayers();
    } else {
    }
  }

  recieveContournFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.contournImporting.addContournToLayer(event.target.files[0], this.selectedLayerIndex);
      if ((this.displayedLayers[this.selectedLayerIndex] as SamplingLayer).contourn !== undefined) {
        this.hasContourn = true;
      }
    } else {
    }
  }

  selectLayer(layerIndex: number, sidenav: MatSidenav): void {
    if (this.selectedLayerIndex === -1) {
      this.changeSelectedLayer(layerIndex);
      sidenav.open();
    } else {
      if (this.selectedLayerIndex === layerIndex) {
        this.selectedLayerIndex = -1;
        this.hasContourn = false;
        sidenav.close();
        this.selectedLayerName = '';
      } else {
        this.changeSelectedLayer(layerIndex);
      }
    }
  }

  changeSelectedLayer(newLayerIndex: number): void {
    if (this.displayedLayers[newLayerIndex] instanceof SamplingLayer) {
      this.selectedLayerType = 0;
      if ((this.displayedLayers[newLayerIndex] as SamplingLayer).contourn !== undefined) {
        this.hasContourn = true;
      } else {
        this.hasContourn = false;
      }
    } else {
      this.selectedLayerType = 1;
      this.hasContourn = false;
    }
    this.selectedLayerIndex = newLayerIndex;
    this.selectedLayerName = this.displayedLayers[newLayerIndex].name;
  }

  exportLayer(fileType: string, ): void {
    this.layerExporting.layerToFile(this.selectedLayerIndex, fileType);
  }

  exportContourn(fileType: string): void {
    this.contournExporting.contournToFile(this.selectedLayerIndex, fileType);
  }

  deleteLayer(sidenav: MatSidenav): void{
    const deleteMessage = 'Tem certeza que deseja excluir a layer '.concat(this.selectedLayerName);
    const deleteDialogReference = this.matDialog.open(ConfirmationDialogComponent, {
      width: '330px',
      height: '150px',
      disableClose: true,
      data: {message: deleteMessage}
    });

    // tslint:disable-next-line: deprecation
    deleteDialogReference.afterClosed().subscribe(userChoice => {
      if (userChoice.answer === 1) {
        this.layerStorage.deleteLayer(this.selectedLayerIndex);
        this.displayedLayers = this.layerStorage.getLayers();
        sidenav.close();
        this.selectedLayerIndex = -1;
        this.messageDelivery.showMessage('A layer '.concat(this.selectedLayerName).concat(' foi excluída com sucesso'), 2400);
        this.selectedLayerName = '';
      }
      if (userChoice.answer === 0) {
        this.messageDelivery.showMessage('A exclusão foi cancelada.', 2400);
      }
    });
  }

}
