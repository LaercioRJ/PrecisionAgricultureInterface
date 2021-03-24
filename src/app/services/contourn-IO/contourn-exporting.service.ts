import { Injectable } from '@angular/core';

import { LayerStorageService } from '../../services/layer-storage.service';

import { Contourn } from '../../classes/contourn';

@Injectable({
  providedIn: 'root'
})
export class ContournExportingService {

  constructor(private layerStorage: LayerStorageService) { }

  contournToFile(layerIndex: number, fileType: string): void {
    const contourn = this.layerStorage.getLayerContourn(layerIndex);
    const content = this.convertContournToString(contourn);
    const file = this.createFile(contourn.fileName, content, fileType);
    this.downloadFile(file);
  }

  private convertContournToString(contourn: Contourn): string[] {
    const fileContent: string[] = [];
    for (let i = 0; i < contourn.coordinates.length; i++) {
      if (i === 0) {
        if (contourn.latitudeHeader !== 'Latitude' && contourn.longitudeHeader !== 'Longitude') {
          fileContent.push(contourn.latitudeHeader);
          fileContent.push(contourn.longitudeHeader.concat('\n', String(contourn.coordinates[i][0])));
        } else {
          fileContent.push(String(contourn.coordinates[i][0]));
        }
        fileContent.push(String(contourn.coordinates[i][1]).concat('\n', String(contourn.coordinates[i + 1][0])));
      } else {
        if (i === (contourn.coordinates.length -  1)) {
          fileContent.push(String(contourn.coordinates[i][1]));
        } else {
          fileContent.push(String(contourn.coordinates[i][1]).concat('\n', String(contourn.coordinates[i + 1][0])));
        }
      }
    }
    return fileContent;
  }

  private createFile(contorunFileName: string, content: any, fileType: string): HTMLAnchorElement {
    const file = document.createElement('a');
    file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    file.setAttribute('download', contorunFileName.concat(fileType));
    file.style.display = 'none';
    return file;
  }

  private downloadFile(file: HTMLAnchorElement): void {
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  }
}
