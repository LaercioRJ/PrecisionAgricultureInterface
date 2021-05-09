import { Injectable } from '@angular/core';

import { DatasetValue } from '../classes/datasetValue';

@Injectable({
  providedIn: 'root'
})
export class ServerDataConvertionService {

  constructor() { }

  datasetValues: DatasetValue[] = [];

  responseToDataset(serverResponse: any): DatasetValue[] {
    this.datasetValues = [];
    if (serverResponse[0].x === undefined) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < serverResponse.length; i++) {
        this.datasetValues.push(new DatasetValue(serverResponse[i].coordinates[0], serverResponse[i].coordinates[1],
          serverResponse[i].data));
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < serverResponse.length; i++) {
        this.datasetValues.push(new DatasetValue(serverResponse[i].x, serverResponse[i].y, serverResponse[i].data));
      }
    }
    return this.datasetValues;
  }
}
