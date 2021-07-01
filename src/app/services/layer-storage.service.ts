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

  addcontourn(contourn: Contourn, layerIndex: number): void {
    (this.storedLayers[layerIndex] as SamplingLayer).contourn = contourn;
  }

  deleteLayer(layerIndex: number): void {
    this.storedLayers.splice(layerIndex, 1);
  }

  getLayer(layerIndex: number): Layer {
    let copiedLayer;
    if (this.storedLayers[layerIndex] instanceof SamplingLayer) {
      const originalLayer = (this.storedLayers[layerIndex] as SamplingLayer);
      copiedLayer = new SamplingLayer(originalLayer.name, originalLayer.latitudeHeader, originalLayer.longitudeHeader,
        originalLayer.dataHeader, originalLayer.datasetLength);
      copiedLayer.contourn = originalLayer.contourn;
      copiedLayer.classesColors = originalLayer.classesColors;
      copiedLayer.idwExpoent = originalLayer.idwExpoent;
      copiedLayer.krigingMethod = originalLayer.krigingMethod;
      copiedLayer.krigingModel = originalLayer.krigingModel;
      copiedLayer.neighbors = originalLayer.neighbors;
      copiedLayer.partialSill = originalLayer.partialSill;
      copiedLayer.pixelX = originalLayer.pixelX;
      copiedLayer.pixelY = originalLayer.pixelY;
      copiedLayer.radius = originalLayer.radius;
      copiedLayer.range = originalLayer.range;
    } else {
      const originalLayer = (this.storedLayers[layerIndex] as ZmLayer);
      copiedLayer = new ZmLayer(originalLayer.name, originalLayer.latitudeHeader, originalLayer.longitudeHeader,
        originalLayer.dataHeader, originalLayer.datasetLength);
      copiedLayer.kernelFormat = (originalLayer as ZmLayer).kernelFormat;
      copiedLayer.kernelSize = (originalLayer as ZmLayer).kernelSize;
      copiedLayer.iterations = (originalLayer as ZmLayer).iterations;
      copiedLayer.rectificationMethod = (originalLayer as ZmLayer).rectificationMethod;
      copiedLayer.classesColors = originalLayer.classesColors;
    }
    let originalData;
    for (let i = 0; i < this.storedLayers[layerIndex].datasetLength; i++) {
      originalData = this.storedLayers[layerIndex].dataset[i];
      copiedLayer.dataset.push(new DatasetValue(originalData.coordinates[0], originalData.coordinates[1], originalData.data));
    }
    return copiedLayer;
  }

  getLayers(): Layer[] {
    return this.storedLayers;
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

  getLayerPoint(layerIndex: number, pointIndex: number): DatasetValue {
    return this.storedLayers[layerIndex].dataset[pointIndex];
  }

  getNumberOfStoredLayers(): number {
    return this.storedLayers.length;
  }

  storeLayer(newLayer: Layer): void {
    this.storedLayers.push(newLayer);
  }

  updateAllLayerDataset(layerIndex: number, newDataset: DatasetValue[]): void {
    this.storedLayers[layerIndex].dataset = newDataset;
    this.storedLayers[layerIndex].datasetLength = newDataset.length;
  }

  updateLayer(layerIndex: number, newLayer: Layer): void {
    this.storedLayers[layerIndex] = newLayer;
  }
}
