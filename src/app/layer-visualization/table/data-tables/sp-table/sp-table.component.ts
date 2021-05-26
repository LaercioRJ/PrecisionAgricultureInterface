import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

import { TablePaginatorService } from '../../../../services/table-paginator.service';

@Component({
  selector: 'app-sp-table',
  templateUrl: './sp-table.component.html',
  styleUrls: ['./sp-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpTableComponent implements OnInit {
  @Input() layer!: Layer;

  actualContournTablePage = 1;
  contournDisplayedColumns!: string[];
  contournLatitudeHeader!: string;
  contournLongitudeHeader!: string;
  contournTableDataSource = new MatTableDataSource<number[]>();
  contournTableLowerIndex = 0;
  contournTableUpperIndex = 20;
  hasContourn = false;
  totalContournTablePages = 0;

  actualDatasetTablePage = 1;
  datasetDisplayedColumns!: string[];
  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  datasetTableLowerIndex = 0;
  datasetTableUpperIndex = 20;
  totalDatasetTablePages = 0;

  constructor(private tablePaginator: TablePaginatorService) { }

  ngOnInit(): void {
    this.initializeDatasetTable();
    if ((this.layer as SamplingLayer).contourn !== undefined) {
      this.initializeContournTable();
    }
  }

  initializeDatasetTable(): void {
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    this.totalDatasetTablePages = this.tablePaginator.calculateTotalTablePages(this.layer.datasetLength, 20);
    for (let i = 0; i < 20; i++) {
      this.datasetTableDataSource.data.push(this.layer.dataset[i]);
    }
  }

  initializeContournTable(): void {
    this.contournDisplayedColumns = ['Identificador', this.contournLatitudeHeader, this.contournLongitudeHeader];
    this.hasContourn = true;
    this.contournLatitudeHeader = (this.layer as SamplingLayer).contourn.latitudeHeader;
    this.contournLongitudeHeader = (this.layer as SamplingLayer).contourn.longitudeHeader;
    for (let i = 0; i < 5; i++) {
      this.contournTableDataSource.data.push((this.layer as SamplingLayer).contourn.coordinates[i]);
    }
  }

  datasetTableNextPage(): void {
    const nextPageData = this.tablePaginator.nextPage(this.layer.datasetLength, 20, this.datasetTableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = nextPageData;
    this.datasetTableLowerIndex = this.datasetTableLowerIndex + 20;
    this.datasetTableUpperIndex = this.datasetTableUpperIndex + nextPageData.length;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, 20,
      this.datasetTableUpperIndex, this.totalDatasetTablePages);
  }

  contournTableNextPage(): void {
    const zmlayer = (this.layer as SamplingLayer);
    const nextpageData = this.tablePaginator.nextPage(zmlayer.contourn.coordinates.length, 20, this.contournTableUpperIndex,
      zmlayer.contourn.coordinates);
    this.contournTableDataSource.data = nextpageData;
    this.contournTableLowerIndex = this.datasetTableLowerIndex + 20;
    this.datasetTableUpperIndex = this.datasetTableUpperIndex + nextpageData.length;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(zmlayer.contourn.coordinates.length, 20,
      this.contournTableUpperIndex, this.totalContournTablePages);
  }

  /*tablePreviousPage(): void {
    const newUpperIndex = this.tableUpperIndex - this.datasetTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(this.layer.datasetLength, 20, this.tableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.tableUpperIndex = newUpperIndex;
    this.tableLowerIndex = this.tableLowerIndex - 20;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, 20, this.tableUpperIndex,
      this.totalDatasetTablePages);
  }*/

}
