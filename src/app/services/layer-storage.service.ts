import { Injectable } from '@angular/core';

import { Layer } from '../classes/layer';

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
}
