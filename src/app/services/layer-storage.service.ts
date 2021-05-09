import { Injectable } from '@angular/core';

import { Contourn } from '../classes/contourn';
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

  addcontourn(contourn: Contourn, layerIndex: number): void {
    (this.storedLayers[layerIndex] as SamplingLayer).contourn = contourn;
    console.log((this.storedLayers[layerIndex] as SamplingLayer).contourn);
  }

  getLayerContourn(layerIndex: number): Contourn {
    let copiedContourn;
    const originalContourn = (this.storedLayers[layerIndex] as SamplingLayer).contourn;
    copiedContourn = new Contourn(originalContourn.fileName, originalContourn.latitudeHeader, originalContourn.longitudeHeader);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < originalContourn.coordinates.length; i++) {
      copiedContourn.coordinates.push(originalContourn.coordinates[i]);
    }
    return copiedContourn;
  }

  updateAllLayerDataset(layerIndex: number, newDataset: DatasetValue[]): void {
    this.storedLayers[layerIndex].dataset = newDataset;
  }

  updateZmLayerAdditionalData(layerIndex: number, rectificationMethod: string, kernelSize: number, kernelFormat: string,
                              iterations: number): void {
    (this.storedLayers[layerIndex] as ZmLayer).rectificationMethod = rectificationMethod;
    (this.storedLayers[layerIndex] as ZmLayer).kernelSize = kernelSize;
    (this.storedLayers[layerIndex] as ZmLayer).kernelFormat = kernelFormat;
    (this.storedLayers[layerIndex] as ZmLayer).iterations = iterations;
  }

  deleteZmLayerAdditionalData(layerIndex: number): void {
    (this.storedLayers[layerIndex] as ZmLayer).rectificationMethod = '';
    (this.storedLayers[layerIndex] as ZmLayer).kernelSize = 0;
    (this.storedLayers[layerIndex] as ZmLayer).kernelFormat = '';
    (this.storedLayers[layerIndex] as ZmLayer).iterations = 0;
  }
}
