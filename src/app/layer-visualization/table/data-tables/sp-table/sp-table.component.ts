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
  displayedColumns!: string[];

  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    for (let i = 0; i < 20; i++) {
      this.tableDataSource.data.push(this.layer.dataset[i]);
    }
  }

}
