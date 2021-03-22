import { Injectable } from '@angular/core';

import { DatasetValue } from '../classes/datasetValue';
import { Layer } from '../classes/layer';
import { SamplingLayer } from '../classes/samplingLayer';
import { ZmLayer } from '../classes/zmLayer';

@Injectable({
  providedIn: 'root'
})
export class LayerStorageService {

  constructor() { }

  private storedLayers: Layer[] = [];

  storeLayer(newLayer: Layer): void {
    this.storedLayers.push(newLayer);
  }

  getLayers(): Layer[] {
    return this.storedLayers;
  }

  getLayer(layerIndex: number): Layer {
    let copiedLayer;
    const originalLayer = this.storedLayers[layerIndex];
    if (originalLayer instanceof SamplingLayer) {
      copiedLayer = new SamplingLayer(originalLayer.name, originalLayer.latitudeHeader, originalLayer.longitudeHeader,
        originalLayer.dataHeader, originalLayer.datasetLength);
    } else {
      copiedLayer = new ZmLayer(originalLayer.name, originalLayer.latitudeHeader, originalLayer.longitudeHeader,
        originalLayer.dataHeader, originalLayer.datasetLength);
    }
    let originalData;
    for (let i = 0; i < originalLayer.datasetLength; i++) {
      originalData = originalLayer.dataset[i];
      copiedLayer.dataset.push(new DatasetValue(originalData.coordinates[0], originalData.coordinates[1], originalData.data));
    }
    return copiedLayer;
  }

  deleteLayer(layerIndex: number): void {
    this.storedLayers.splice(layerIndex, 1);
  }
}
