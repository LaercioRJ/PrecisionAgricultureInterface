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
  contournLength = 0;
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
    const spLayer = (this.layer as SamplingLayer);
    this.hasContourn = true;
    this.contournLatitudeHeader = spLayer.contourn.latitudeHeader;
    this.contournLongitudeHeader = spLayer.contourn.longitudeHeader;
    this.contournLength = spLayer.contourn.coordinates.length;
    this.contournDisplayedColumns = ['Identificador', this.contournLatitudeHeader, this.contournLongitudeHeader];
    this.totalContournTablePages = this.tablePaginator.calculateTotalTablePages( spLayer.contourn.coordinates.length,
      this.contournPointsPerPage);
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

  contournTablePreviousPage(): void {
    const splayer = (this.layer as SamplingLayer);
    const newUpperIndex = this.contournTableUpperIndex - this.contournTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(splayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, splayer.contourn);
    this.contournTableDataSource.data = previousPageData;
    this.contournTableUpperIndex = newUpperIndex;
    this.contournTableLowerIndex = this.datasetTableLowerIndex - this.contournPointsPerPage;
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(splayer.contourn.coordinates.length,
      this.contournPointsPerPage, this.contournTableUpperIndex, this.totalContournTablePages);
  }

  contournTableNextPage(): void {
    const splayer = (this.layer as SamplingLayer);
    const nextpageData = this.tablePaginator.nextPage(splayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, splayer.contourn.coordinates);
    this.contournTableDataSource.data = nextpageData;
    this.contournTableLowerIndex = this.contournTableLowerIndex + this.contournPointsPerPage;
    this.contournTableUpperIndex = this.contournTableUpperIndex + nextpageData.length;
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(splayer.contourn.coordinates.length,
      this.contournPointsPerPage, this.contournTableUpperIndex, this.totalContournTablePages);
  }

}
