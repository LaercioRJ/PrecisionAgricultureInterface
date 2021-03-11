import { Component, OnInit } from '@angular/core';

import { LayerImportingService } from '../../services/layer-importing.service';
import { LayerStorageService } from '../../services/layer-storage.service';

import { Layer } from '../../classes/layer';

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html',
  styleUrls: ['./cards-display.component.css']
})
export class CardsDisplayComponent implements OnInit {

  constructor(private layerImporting: LayerImportingService,
              private layerStorage: LayerStorageService) { }

  displayedLayers: Layer[] = [];

  ngOnInit(): void {
    this.displayedLayers = this.layerStorage.getLayersNoSampling();
  }

  recieveLayerFile(event: any, layerType: number): void {
    if (event.target.files && event.target.files[0]) {
      this.layerImporting.fileToLayer(event.target.files[0], layerType);
      this.displayedLayers = this.layerStorage.getLayersNoSampling();
    } else {
    }
  }

}
