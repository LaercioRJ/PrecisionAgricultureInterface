import { Injectable } from '@angular/core';

import { LayerStorageService } from '../../services/layer-storage.service';
import { MessageDeliveryService } from '../../services/message-delivery.service';

import { Contourn } from '../../classes/contourn';

@Injectable({
  providedIn: 'root'
})
export class ContournImportingService {

  constructor(private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService) { }

  private dataseparator!: string;
  private fileName = '';
  private latitudeHeader = 'Latitude';
  private longitudeHeader = 'Longitude';
  private coordinates: number[][] = [];

  addContournToLayer(file: File, layerIndex: number): void {
    this.coordinates = [];
    this.confirmFileType(file.name);
    this.getFileName(file.name);
    this.getFileContentAndStore(file, layerIndex);
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

  private getFileContentAndStore(file: File, layerIndex: number): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const content = reader.result as string;
      this.getFileSeparator(content.split(/\n/)[0]);
      const haveHeaders = this.extractHeaders(content.split(/\n/)[0]);
      this.extractCoordinates(haveHeaders, content, layerIndex);
      this.addContourn(layerIndex);
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
    const separatedHeaders: string[] = fileHeaders.split(this.dataseparator);
    if (isNaN(Number(separatedHeaders[0] + 1)) && isNaN(Number(separatedHeaders[1] + 1))) {
      this.latitudeHeader = separatedHeaders[0];
      this.longitudeHeader = separatedHeaders[1];
      return 1;
    } else {
      return 0;
    }
  }

  private extractCoordinates(haveHeaders: number, fileContent: any, layerIndex: number): void {
    let fileLines: string[];
    let lineValues: string[];
    fileLines = fileContent.split(/\n/);
    for (; haveHeaders < fileLines.length; haveHeaders++) {
      this.validateComaSeparation(fileLines[haveHeaders], haveHeaders + 1);
      lineValues = fileLines[haveHeaders].split(this.dataseparator);
      this.validateNumberFields(lineValues, haveHeaders);
      this.coordinates.push([Number(lineValues[1]), Number(lineValues[0])]);
    }
  }

  private validateComaSeparation(fileLine: string, lineIndex: number): void {
    const lineFirstHalf = fileLine.slice(0, fileLine.indexOf(this.dataseparator) + 1);
    const lineSecondHalf = fileLine.slice(fileLine.indexOf(this.dataseparator) + 1, fileLine.length);
    if ((lineFirstHalf.indexOf('.') > lineFirstHalf.indexOf(this.dataseparator)) || (lineFirstHalf.indexOf('.') === -1 )) {
      console.log('Erro 1');
      this.fileReadingErrorMessage(lineIndex);
    }
    if ((lineSecondHalf.indexOf(this.dataseparator) !== -1) || (lineSecondHalf.indexOf('.') === -1)) {
      console.log('Erro 2');
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

  private fileReadingErrorMessage(lineIndex: number): void {
    this.messageDelivery.showMessage('Erro: Há problemas no preenchimento do arquivo de contorno. Linha: '.concat(String(lineIndex)), 2700);
    throw new Error('Problem while reading contourn file.');
  }

  private addContourn(layerIndex: number): void {
    const contourn = new Contourn(this.fileName, this.latitudeHeader, this.longitudeHeader);
    contourn.coordinates = this.coordinates;
    this.layerStorage.addcontourn(contourn, layerIndex);
    this.coordinates = [];
    this.messageDelivery.showMessage('Contorno adicionado com sucesso!', 2500);
  }
}
