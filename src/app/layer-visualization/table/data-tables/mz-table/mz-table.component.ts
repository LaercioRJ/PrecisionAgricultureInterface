import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';
import { ZmLayer } from '../../../../classes/zmLayer';

@Component({
  selector: 'app-mz-table',
  templateUrl: './mz-table.component.html',
  styleUrls: ['./mz-table.component.css']
})
export class MzTableComponent implements OnInit {
  @Input() layer!: Layer;

  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  datasetDisplayedColumns!: string[];

  constructor() { }

  ngOnInit(): void {
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    for (let i = 0; i < 20; i++) {
      this.datasetTableDataSource.data.push(this.layer.dataset[i]);
    }
  }

}
