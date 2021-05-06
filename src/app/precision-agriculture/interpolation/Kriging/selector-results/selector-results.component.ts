import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { KrigingSelectorResult } from '../../../../classes/krigingSelectorResult';

@Component({
  selector: 'app-selector-results',
  templateUrl: './selector-results.component.html',
  styleUrls: ['./selector-results.component.css']
})
export class SelectorResultsComponent implements OnInit {

  displayedColumns = ['ISI', 'Método', 'Modelo', 'Nugget E.', 'Range', 'Partial Sill', 'Selecionar'];
  dataSource = new MatTableDataSource<KrigingSelectorResult>();
  convertedData: KrigingSelectorResult[] = [];

  constructor(private selectorDialogRef: MatDialogRef<SelectorResultsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.convertSelectorData(this.data.results);
    this.dataSource.data = this.sortResultsByIsi();
  }

  convertSelectorData(selectorData: any): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < selectorData.length; i++) {
      this.convertedData.push({isi: selectorData[i].isi, method: selectorData[i].method, model: selectorData[i].model,
        nuggetEffect: selectorData[i].nuggetEffect, range: selectorData[i].range, partialSill: selectorData[i].partialSill});
      this.convertedData[i].isi = this.thirdHouseRounding(this.convertedData[i].isi);
      this.convertedData[i].range = this.thirdHouseRounding(this.convertedData[i].nuggetEffect);
      this.convertedData[i].partialSill = this.thirdHouseRounding(this.convertedData[i].partialSill);
      this.convertedData[i].nuggetEffect = this.thirdHouseRounding(this.convertedData[i].nuggetEffect);
    }
  }

  thirdHouseRounding(numberToRound: number): number {
    return Math.round((numberToRound + Number.EPSILON) * 1000) / 1000;
  }

  sortResultsByIsi(): KrigingSelectorResult[] {
    const sortedResult: KrigingSelectorResult[] = [];
    const loopLength = this.convertedData.length;
    for (let i = 0; i < loopLength; i++) {
      let smallerIsi = this.convertedData[0];
      let smallerIsiIndex = 0;
      for (let j = 1; j < this.convertedData.length; j++) {
        if (this.convertedData[j].isi < smallerIsi.isi) {
          smallerIsi = this.convertedData[j];
          smallerIsiIndex = j;
        }
      }
      this.convertedData.splice(smallerIsiIndex, 1);
      sortedResult.push(smallerIsi);
    }
    return sortedResult;
  }

  selectResult(dataIndex: number): void {
    this.selectorDialogRef.close({
      data: this.dataSource.data[dataIndex]
    });
  }

}
