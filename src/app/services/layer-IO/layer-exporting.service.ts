import { Injectable } from '@angular/core';

import { LayerStorageService } from '../layer-storage.service';

import { Layer } from '../../classes/layer';

@Injectable({
  providedIn: 'root'
})
export class LayerExportingService {

  constructor(private layerStorage: LayerStorageService) { }

  layerToFile(layerIndex: number, fileType: string): void {
    const layer = this.layerStorage.getLayer(layerIndex);
    const fileContent = this.convertLayerToString(layer);
    const file = this.createFile(layer.name, fileContent, fileType);
    this.downloadFile(file);
  }

  private convertLayerToString(layer: Layer): string[] {
    const fileContent: string[] = [];
    for (let i = 0; i < layer.datasetLength; i++) {
      if (i === 0) {
        if (layer.latitudeHeader !== 'Latitude' && layer.longitudeHeader !== 'Longitude' && layer.dataHeader !== 'Classe') {
          fileContent.push(layer.latitudeHeader);
          fileContent.push(layer.longitudeHeader);
          fileContent.push(layer.dataHeader.concat('\n', String(layer.dataset[i].coordinates[0])));
        } else {
          fileContent.push(String(layer.dataset[i].coordinates[0]));
        }
        fileContent.push(String(layer.dataset[i].coordinates[1]));
        fileContent.push(String(layer.dataset[i].data).concat('\n', String(layer.dataset[i + 1].coordinates[0])));
      } else {
        if (i === (layer.datasetLength -  1)) {
          fileContent.push(String(layer.dataset[i].coordinates[1]));
          fileContent.push(String(layer.dataset[i].data));
        } else {
          fileContent.push(String(layer.dataset[i].coordinates[1]));
          fileContent.push(String(layer.dataset[i].data).concat('\n', String(layer.dataset[i + 1].coordinates[0])));
        }
      }
    }
    return fileContent;
  }

  private createFile(layerName: string, content: any, fileType: string): HTMLAnchorElement {
    const file = document.createElement('a');
    file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    file.setAttribute('download', layerName.concat(fileType));
    file.style.display = 'none';
    return file;
  }

  private downloadFile(file: HTMLAnchorElement): void {
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  }
}
