import { Injectable } from '@angular/core';

import { IntegerValidationService } from '../integer-validation.service';
import { MessageDeliveryService } from '../message-delivery.service';
import { LayerStorageService } from '../layer-storage.service';

import { DatasetValue } from '../../classes/datasetValue';
import { SamplingLayer } from '../../classes/samplingLayer';
import { ZmLayer } from '../../classes/zmLayer';

@Injectable({
  providedIn: 'root'
})
export class LayerImportingService {

  private fileName = '';
  private latitudeHeader = 'Latitude';
  private longitudeHeader = 'Longitude';
  private dataHeader = 'Classe';
  private dataset: DatasetValue[] = [];

  constructor(private integerValidation: IntegerValidationService,
              private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService) { }

  fileToLayer(file: File, layerType: number): void {
    /*layerType = 0 -> sampling point layer
      layerType = 1 -> management zone layer*/
    this.dataset = [];
    this.confirmFileType(file.name);
    this.getFileName(file.name);
    this.getFileContentAndStore(file, layerType);
  }

  private confirmFileType(fileName: string): void {
    const fileExtension = fileName.slice(fileName.length - 4, fileName.length);
    if (fileExtension !== '.txt' && fileExtension !== '.csv') {
      this.messageDelivery.showMessage('O arquivo inserido não é de formato suportado, por favor use .csv ou .txt.', 2500);
      throw new Error('Unsupported file format.');
    }
  }

  private getFileName(fileName: string): void {
    this.fileName = fileName.slice(0, this.getFileName.length - 5);
  }

  private getFileContentAndStore(file: File, layerType: number): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const content = reader.result as string;
      const haveHeaders = this.extractHeaders(content.split(/\n/)[0]);
      this.extractSamplingPoints(haveHeaders, content, layerType);
    };
  }

  private extractHeaders(fileHeaders: string): number {
    const separatedHeaders: string[] = fileHeaders.split(',');
    if (isNaN(Number(separatedHeaders[0] + 1)) && isNaN(Number(separatedHeaders[1] + 1)) && isNaN(Number(separatedHeaders[2] + 1))) {
      this.latitudeHeader = separatedHeaders[0];
      this.longitudeHeader = separatedHeaders[1];
      this.dataHeader = separatedHeaders[2];
      return 1;
    } else {
      return 0;
    }
  }

  private extractSamplingPoints(haveHeaders: number, fileContent: any, layerType: number): void {
    let fileLines: string[];
    let lineValues: string[];
    fileLines = fileContent.split(/\n/);
    for (; haveHeaders < fileLines.length; haveHeaders++) {
      lineValues = fileLines[haveHeaders].split(',');
      this.validateNumberFields(lineValues);
      if (layerType === 1) {
        this.validateZMClasses(Number(lineValues[2]));
      }
      this.dataset.push(new DatasetValue(Number(lineValues[0]), Number(lineValues[1]), Number(lineValues[2])));
    }
    this.storeLayer(layerType);
  }

  private validateNumberFields(values: string[]): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < values.length; i++) {
      if (isNaN(Number(values[i]))) {
        this.messageDelivery.showMessage('Erro: há letras nos campos de coordenadas ou atributo.', 2500);
        throw new Error('Invalid data.');
      }
    }
  }

  private validateZMClasses(data: number): void {
    const isInteger = this.integerValidation.isInteger(data);
    if (isInteger === false) {
      this.messageDelivery.showMessage('Erro: As classes de uma layer de ZM devem ser valores inteiros.', 2500);
      throw new Error('Invalid data.');
    }
    if ((data < 1) || (data > 10)) {
      this.messageDelivery.showMessage('Erro: As classes de uma layer de ZM vão de 1 até 10 apenas.', 2500);
      throw new Error('Invalid data.');
    }
  }

  private storeLayer(layerType: number): void {
    let layer;
    if (layerType === 0) {
      layer = new SamplingLayer(this.fileName, this.latitudeHeader,  this.longitudeHeader, this.dataHeader, this.dataset.length);
    } else {
      layer = new ZmLayer(this.fileName, this.latitudeHeader,  this.longitudeHeader, this.dataHeader, this.dataset.length);
    }
    layer.dataset = this.dataset;
    this.layerStorage.storeLayer(layer);
    this.messageDelivery.showMessage('Layer adicionada com sucesso!', 2200);
  }
}
