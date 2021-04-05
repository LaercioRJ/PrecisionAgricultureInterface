import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';

@Component({
  selector: 'app-sp-table',
  templateUrl: './sp-table.component.html',
  styleUrls: ['./sp-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpTableComponent implements OnInit {
  @Input() layer!: Layer;

  tableDataSource = new MatTableDataSource<DatasetValue>();
  tableDisplayedColumns!: string[];

  constructor() { }

  ngOnInit(): void {
    this.tableDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
  }

}
