import { Injectable } from '@angular/core';

import { DatasetValue } from '../classes/datasetValue';

@Injectable({
  providedIn: 'root'
})
export class ServerDataConvertionService {

  constructor() { }

  datasetValues: DatasetValue[] = [];

  responseToDataset(serverResult: any): DatasetValue[] {
    this.datasetValues = [];
    if (serverResult[0].x === undefined) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < serverResult.length; i++) {
        this.datasetValues.push(new DatasetValue(serverResult[i].coordinates[0], serverResult[i].coordinates[1],
          serverResult[i].data));
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < serverResult.length; i++) {
        this.datasetValues.push(new DatasetValue(serverResult[i].x, serverResult[i].y, serverResult[i].data));
      }
    }
    return this.datasetValues;
  }
}
