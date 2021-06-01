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
      copiedLayer.contourn = (this.storedLayers[layerIndex] as SamplingLayer).contourn;
    } else {
      copiedLayer = new ZmLayer(originalLayer.name, originalLayer.latitudeHeader, originalLayer.longitudeHeader,
        originalLayer.dataHeader, originalLayer.datasetLength);
      copiedLayer.kernelFormat = (originalLayer as ZmLayer).kernelFormat;
      copiedLayer.kernelSize = (originalLayer as ZmLayer).kernelSize;
      copiedLayer.iterations = (originalLayer as ZmLayer).iterations;
      copiedLayer.rectificationMethod = (originalLayer as ZmLayer).rectificationMethod;
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

  getNumberOfStoredLayers(): number {
    return this.storedLayers.length;
  }

  updateAllLayerDataset(layerIndex: number, newDataset: DatasetValue[]): void {
    this.storedLayers[layerIndex].dataset = newDataset;
  }

  updateKrigingAdditionalData(pixelX: number, pixelY: number, krigingModel: string, krigingMethod: string, partialSill: number,
                              range: number, layerIndex: number): void {
    (this.storedLayers[layerIndex] as SamplingLayer).krigingMethod = krigingMethod;
    (this.storedLayers[layerIndex] as SamplingLayer).krigingModel = krigingModel;
    (this.storedLayers[layerIndex] as SamplingLayer).partialSill = partialSill;
    (this.storedLayers[layerIndex] as SamplingLayer).range = range;
    (this.storedLayers[layerIndex] as SamplingLayer).pixelX = pixelX;
    (this.storedLayers[layerIndex] as SamplingLayer).pixelY = pixelY;
  }

  deleteKrigingAdditionalData(layerIndex: number): void {
    (this.storedLayers[layerIndex] as SamplingLayer).krigingMethod = '';
    (this.storedLayers[layerIndex] as SamplingLayer).krigingModel = '';
    (this.storedLayers[layerIndex] as SamplingLayer).pixelX = 0;
    (this.storedLayers[layerIndex] as SamplingLayer).pixelY = 0;
    (this.storedLayers[layerIndex] as SamplingLayer).partialSill = 0;
    (this.storedLayers[layerIndex] as SamplingLayer).range = 0;
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
