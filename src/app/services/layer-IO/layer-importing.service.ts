import { Injectable } from '@angular/core';

import { NumberInputValidationService } from '../validation/number-input-validation.service';
import { MessageDeliveryService } from '../message-delivery.service';
import { LayerStorageService } from '../layer-storage.service';

import { ClassesColors } from '../../classes/classesColors';
import { DatasetValue } from '../../classes/datasetValue';
import { SamplingLayer } from '../../classes/samplingLayer';
import { ZmLayer } from '../../classes/zmLayer';

@Injectable({
  providedIn: 'root'
})
export class LayerImportingService {

  private dataHeader = 'Classe';
  private dataseparator!: string;
  private dataset: DatasetValue[] = [];
  private fileName = '';
  private latitudeHeader = 'Latitude';
  private longitudeHeader = 'Longitude';

  constructor(private numberValidation: NumberInputValidationService,
              private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService) { }

  fileToLayer(file: File, layerType: number): void {
    /*layerType = 0 -> sampling point layer
      layerType = 1 -> management zone layer*/
    if (layerType === 0) {
      this.dataHeader = 'Amostra';
    }
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
      this.getFileSeparator(content.split(/\n/)[0]);
      const haveHeaders = this.extractHeaders(content.split(/\n/)[0]);
      this.extractSamplingPoints(haveHeaders, content, layerType);
    };
  }

  private getFileSeparator(fileFirstLine: string): void {
    const separatorsFound = [];
    if (fileFirstLine.lastIndexOf(',') !== -1) {
      separatorsFound.push(',');
    }
    if (fileFirstLine.lastIndexOf(';') !== -1) {
      separatorsFound.push(';');
    }
    if (fileFirstLine.lastIndexOf('\t') !== -1) {
      separatorsFound.push('\t');
    }
    if (separatorsFound.length !== 1) {
      this.fileReadingErrorMessage(1);
    }
    this.dataseparator = separatorsFound[0];
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
      this.validateDataSeparation(fileLines[haveHeaders], haveHeaders);
      lineValues = fileLines[haveHeaders].split(this.dataseparator);
      this.validateNumberFields(lineValues, haveHeaders + 1);
      if (layerType === 1) {
        this.validateZMClasses(Number(lineValues[2]), haveHeaders + 1);
      }
      this.dataset.push(new DatasetValue(Number(lineValues[0]), Number(lineValues[1]), Number(lineValues[2])));
    }
    this.storeLayer(layerType);
  }

  private validateDataSeparation(fileLine: string, lineIndex: number): void {
    const lineFirstHalf = fileLine.slice(0, fileLine.indexOf(this.dataseparator) + 1);
    const lineSecondHalf = fileLine.slice(fileLine.indexOf(this.dataseparator) + 1, fileLine.lastIndexOf(this.dataseparator) + 1);
    if ((lineFirstHalf.indexOf('.') > lineFirstHalf.indexOf(this.dataseparator)) || (lineFirstHalf.indexOf('.') === -1 )) {
      this.fileReadingErrorMessage(lineIndex);
    }
    if ((lineSecondHalf.indexOf('.') > lineSecondHalf.indexOf(this.dataseparator)) || (lineSecondHalf.indexOf('.') === -1)) {
      this.fileReadingErrorMessage(lineIndex);
    }
  }

  private validateNumberFields(values: string[], lineIndex: number): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < values.length; i++) {
      if (isNaN(Number(values[i]))) {
        this.fileReadingErrorMessage(lineIndex);
      }
    }
  }

  private validateZMClasses(data: number, lineIndex: number): void {
    if (!this.numberValidation.isInteger(data)) {
      this.fileReadingErrorMessage(lineIndex);
    }
    if (!this.numberValidation.isWithinBounds(data, 1, 10)) {
      this.fileReadingErrorMessage(lineIndex);
    }
  }

  private fileReadingErrorMessage(lineIndex: number): void {
    this.messageDelivery.showMessage('Erro: Há problemas no preenchimento do arquivo de layer. Linha: '.concat(String(lineIndex)), 2700);
    throw new Error('Problem while reading layer file.');
  }

  private storeLayer(layerType: number): void {
    let layer;
    if (layerType === 0) {
      layer = new SamplingLayer(this.fileName, this.latitudeHeader,  this.longitudeHeader, this.dataHeader, this.dataset.length);
      layer.dataset = this.dataset;
      layer.classesColors = new ClassesColors(2);
    } else {
      layer = new ZmLayer(this.fileName, this.latitudeHeader,  this.longitudeHeader, this.dataHeader, this.dataset.length);
      layer.dataset = this.dataset;
      const classesQuantity = layer.discoverHigherClass();
      layer.classesColors = new ClassesColors(classesQuantity);
    }
    this.layerStorage.storeLayer(layer);
    this.messageDelivery.showMessage('Layer adicionada com sucesso!', 2200);
  }
}
