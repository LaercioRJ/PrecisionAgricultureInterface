import { Injectable } from '@angular/core';

import { Layer } from '../classes/layer';
import { SamplingLayer } from '../classes/samplingLayer';
import { ZmLayer } from '../classes/zmLayer';

@Injectable({
  providedIn: 'root'
})
export class LayerStorageService {

  constructor() { }

  storedLayers: Layer[] = [];

  storeLayer(newLayer: Layer): void {
    this.storedLayers.push(newLayer);
  }

  getLayersNoSampling(): Layer[] {
    const layersNoSampling: Layer[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.storedLayers.length; i++) {
      let layerCopy;
      if (this.storedLayers[i] instanceof SamplingLayer) {
        layerCopy = new SamplingLayer(this.storedLayers[i].layerName, this.storedLayers[i].latitudeHeader,
          this.storedLayers[i].longitudeHeader, this.storedLayers[i].dataHeader, this.storedLayers[i].datasetLength);
      } else {
        layerCopy = new ZmLayer(this.storedLayers[i].layerName, this.storedLayers[i].latitudeHeader,
          this.storedLayers[i].longitudeHeader, this.storedLayers[i].dataHeader, this.storedLayers[i].datasetLength);
      }
      layersNoSampling.push(layerCopy);
    }
    return layersNoSampling;
  }
}
