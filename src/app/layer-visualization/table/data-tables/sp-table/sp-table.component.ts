import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

@Component({
  selector: 'app-sp-table',
  templateUrl: './sp-table.component.html',
  styleUrls: ['./sp-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpTableComponent implements OnInit {
  @Input() layer!: Layer;

  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  contournTableDataSource = new MatTableDataSource<number[]>();
  datasetDisplayedColumns!: string[];
  contournDisplayedColumns!: string[];
  contournLatitudeHeader!: string;
  contournLongitudeHeader!: string;
  hasContourn = false;

  constructor() { }

  ngOnInit(): void {
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    for (let i = 0; i < 20; i++) {
      this.datasetTableDataSource.data.push(this.layer.dataset[i]);
    }
    if ((this.layer as SamplingLayer).contourn !== undefined) {
      this.hasContourn = true;
      this.contournLatitudeHeader = (this.layer as SamplingLayer).contourn.latitudeHeader;
      this.contournLongitudeHeader = (this.layer as SamplingLayer).contourn.longitudeHeader;
      this.contournDisplayedColumns = ['Identificador', this.contournLatitudeHeader, this.contournLongitudeHeader];
      for (let i = 0; i < 5; i++) {
        this.contournTableDataSource.data.push((this.layer as SamplingLayer).contourn.coordinates[i]);
      }
    }
  }

}
