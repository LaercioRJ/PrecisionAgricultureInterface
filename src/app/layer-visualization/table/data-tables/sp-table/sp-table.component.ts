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
  contournPointsPerPage = 20;
  contournLatitudeHeader!: string;
  contournLongitudeHeader!: string;
  contournTableDataSource = new MatTableDataSource<number[]>();
  contournTableLowerIndex = (this.contournPointsPerPage * -1);
  contournTableUpperIndex = 0;
  hasContourn = false;
  totalContournTablePages = 0;

  actualDatasetTablePage = 1;
  datasetDisplayedColumns!: string[];
  datasetPointsPerPage = 20;
  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  datasetTableLowerIndex = (this.datasetPointsPerPage * -1);
  datasetTableUpperIndex = 0;
  totalDatasetTablePages = 0;

  constructor(private tablePaginator: TablePaginatorService) { }

  ngOnInit(): void {
    this.initializeDatasetTable();
    if ((this.layer as SamplingLayer).contourn !== undefined) {
      this.initializeContournTable();
    }
  }

  // TODO Colocar limitação de disabled para next page em contorno

  initializeDatasetTable(): void {
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    this.totalDatasetTablePages = this.tablePaginator.calculateTotalTablePages(this.layer.datasetLength, this.datasetPointsPerPage);
    this.datasetTableNextPage();
  }

  initializeContournTable(): void {
    this.contournDisplayedColumns = ['Identificador', this.contournLatitudeHeader, this.contournLongitudeHeader];
    this.totalContournTablePages = this.tablePaginator.calculateTotalTablePages(
      (this.layer as SamplingLayer).contourn.coordinates.length, this.contournPointsPerPage);
    this.hasContourn = true;
    this.contournLatitudeHeader = (this.layer as SamplingLayer).contourn.latitudeHeader;
    this.contournLongitudeHeader = (this.layer as SamplingLayer).contourn.longitudeHeader;
    this.contournTableNextPage();
  }

  datasetTableNextPage(): void {
    const nextPageData = this.tablePaginator.nextPage(this.layer.datasetLength, this.datasetPointsPerPage, this.datasetTableUpperIndex,
      this.layer.dataset);
    this.datasetTableDataSource.data = nextPageData;
    this.datasetTableLowerIndex = this.datasetTableLowerIndex + this.datasetPointsPerPage;
    this.datasetTableUpperIndex = this.datasetTableUpperIndex + nextPageData.length;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.totalDatasetTablePages);
  }

  datasetTablePreviousPage(): void {
    const newUpperIndex = this.datasetTableUpperIndex - this.datasetTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.datasetTableUpperIndex = newUpperIndex;
    this.datasetTableLowerIndex = this.datasetTableLowerIndex - this.datasetPointsPerPage;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.totalDatasetTablePages);
  }

  contournTableNextPage(): void {
    const zmlayer = (this.layer as SamplingLayer);
    const nextpageData = this.tablePaginator.nextPage(zmlayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, zmlayer.contourn.coordinates);
    this.contournTableDataSource.data = nextpageData;
    this.contournTableLowerIndex = this.datasetTableLowerIndex + this.contournPointsPerPage;
    this.contournTableUpperIndex = this.datasetTableUpperIndex + nextpageData.length;
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(zmlayer.contourn.coordinates.length,
      this.contournPointsPerPage, this.contournTableUpperIndex, this.totalContournTablePages);
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
