import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { LayerExportingService } from '../../services/layer-exporting.service';
import { LayerImportingService } from '../../services/layer-importing.service';
import { LayerStorageService } from '../../services/layer-storage.service';

import { Layer } from '../../classes/layer';
import { SamplingLayer } from '../../classes/samplingLayer';

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html',
  styleUrls: ['./cards-display.component.css']
})
export class CardsDisplayComponent implements OnInit {

  constructor(private layerExporting: LayerExportingService,
              private layerImporting: LayerImportingService,
              private layerStorage: LayerStorageService) { }

  displayedLayers: Layer[] = [];
  selectedLayerIndex = -1;
  selectedLayerName = '';
  selectedLayerType = 0;
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

  selectLayer(layerIndex: number, sidenav: MatSidenav): void {
    if (this.selectedLayerIndex === -1) {
      this.changeSelectedLayer(layerIndex);
      sidenav.open();
    } else {
      if (this.selectedLayerIndex === layerIndex) {
        this.selectedLayerIndex = -1;
        sidenav.close();
      } else {
        this.changeSelectedLayer(layerIndex);
      }
    }
  }

  changeSelectedLayer(newLayerIndex: number): void {
    if (this.displayedLayers[newLayerIndex] instanceof SamplingLayer) {
      this.selectedLayerType = 0;
    } else {
      this.selectedLayerType = 1;
    }
    this.selectedLayerIndex = newLayerIndex;
    this.selectedLayerName = this.displayedLayers[newLayerIndex].name;
  }

  exportLayer(fileType: string, ): void {
    this.layerExporting.layerToFile(this.selectedLayerIndex, fileType);
  }

  exportContourn(fileType: string): void {

  }

}
