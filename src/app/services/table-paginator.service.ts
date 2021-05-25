import { Injectable } from '@angular/core';

import { DatasetValue } from '../classes/datasetValue';

@Injectable({
  providedIn: 'root'
})
export class TablePaginatorService {

  constructor() { }

  nextPage(pointsQuantity: number, pointsExhibited: number, exhibitionUpperIndex: number, tableContent: DatasetValue[]): DatasetValue[] {
    const nextPagePoints = [];
    let actualPagePointsQuantity = pointsExhibited;
    if ((exhibitionUpperIndex + pointsExhibited) > pointsQuantity) {
      actualPagePointsQuantity = pointsQuantity - exhibitionUpperIndex;
    }
    for (let i = 0; i < actualPagePointsQuantity; i++) {
      nextPagePoints.push(tableContent[exhibitionUpperIndex + i]);
    }
    return nextPagePoints;
  }

  previousPage(pointsQuantity: number, pointsExhibited: number, exhibitionUpperIndex: number, tableContent: DatasetValue[])
  : DatasetValue[] {
    const previousPagePoints = [];
    let newUpperIndex = 0;
    if ((exhibitionUpperIndex === pointsQuantity) && ((pointsQuantity % pointsExhibited) !== 0)) {
      newUpperIndex = exhibitionUpperIndex - (pointsQuantity % pointsExhibited);
    } else {
      newUpperIndex = exhibitionUpperIndex - pointsExhibited;
    }
    for (let i = 0; i < pointsExhibited; i++) {
      previousPagePoints.push(tableContent[newUpperIndex - (pointsExhibited - i)]);
    }
    return previousPagePoints;
  }

  calculateTotalTablePages(pointsQuantity: number, pointsExhibited: number): number {
    let totalTablePages = 0;
    if ((pointsQuantity % pointsExhibited) === 0) {
      totalTablePages = (pointsQuantity / pointsExhibited);
    } else {
      totalTablePages = (pointsQuantity - (pointsQuantity % pointsExhibited));
      totalTablePages = totalTablePages / pointsExhibited;
      totalTablePages = totalTablePages + 1;
    }
    return totalTablePages;
  }

  calculateActualTablePage(pointsQuantity: number, pointsExhibited: number, exhibitionUpperIndex: number, totalTablePages: number): number {
    if (((pointsQuantity % pointsExhibited) === 0) || (pointsQuantity !== exhibitionUpperIndex)) {
      return (exhibitionUpperIndex / pointsExhibited);
    } else {
      return totalTablePages;
    }
  }

}
