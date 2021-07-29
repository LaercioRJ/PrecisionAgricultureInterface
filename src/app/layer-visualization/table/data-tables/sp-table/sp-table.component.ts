import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

import { MessageDeliveryService } from '../../../../services/message-delivery.service';
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

  alteredPointsId: number[] = [];
  isEditing = false;
  wasEdited = false;

  constructor(private messageDelivery: MessageDeliveryService,
              private tablePaginator: TablePaginatorService) { }

  ngOnInit(): void {
    this.initializeDatasetTable();
    if ((this.layer as SamplingLayer).contourn !== undefined) {
      this.initializeContournTable();
    }
  }

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

  editTableData(event: any, tablePointIndex: number): void {
    if (String(event.target.value) === '') {
      this.messageDelivery.showMessage('Por favor, preencha o campo', 2300);
      event.target.value = this.layer.dataset[this.datasetTableLowerIndex + tablePointIndex].data;
    } else {
      this.wasEdited = true;
      this.layer.dataset[this.datasetTableLowerIndex + tablePointIndex].data = event.target.value;
      this.alteredPointsId.push(this.datasetTableLowerIndex + tablePointIndex);
    }
  }

  datasetTableNextTenPages(): void {
    const nextData = this.tablePaginator.nextTenPages(this.layer.datasetLength, this.datasetPointsPerPage, this.datasetTableUpperIndex,
      this.layer.dataset);
    this.datasetTableDataSource.data = nextData;
    this.datasetTableLowerIndex = this.datasetTableLowerIndex + (this.datasetPointsPerPage * 10);
    this.datasetTableUpperIndex = nextData.length + this.datasetTableLowerIndex;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.totalDatasetTablePages);
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

  datasetTablePreviousTenPages(): void {
    const newUpperIndex = this.datasetTableUpperIndex - (this.datasetPointsPerPage * 10);
    const previousPageData = this.tablePaginator.previousTenPages(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.datasetTableUpperIndex = newUpperIndex;
    this.datasetTableLowerIndex = this.datasetTableUpperIndex - this.datasetPointsPerPage;
    this.actualDatasetTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.datasetPointsPerPage,
      this.datasetTableUpperIndex, this.totalDatasetTablePages);
  }

  contournTablePreviousPage(): void {
    const splayer = (this.layer as SamplingLayer);
    const newUpperIndex = this.contournTableUpperIndex - this.contournTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(splayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, splayer.contourn.coordinates);
    this.contournTableDataSource.data = previousPageData;
    this.contournTableUpperIndex = newUpperIndex;
    this.contournTableLowerIndex = this.contournTableLowerIndex - this.contournPointsPerPage;
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(splayer.contourn.coordinates.length,
      this.contournPointsPerPage, this.contournTableUpperIndex, this.totalContournTablePages);
  }

  contournTablePreviousTenPages(): void {
    const spLayer = (this.layer as SamplingLayer);
    const newUpperIndex = this.contournTableUpperIndex - (this.contournPointsPerPage * 10);
    const previousPageData = this.tablePaginator.previousTenPages(spLayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, spLayer.contourn.coordinates);
    this.contournTableDataSource.data = previousPageData;
    this.contournTableUpperIndex = newUpperIndex;
    this.contournTableLowerIndex = this.contournTableLowerIndex - (this.contournPointsPerPage * 10);
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(spLayer.contourn.coordinates.length,
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

  contournTableNextTenPages(): void {
    const spLayer = (this.layer as SamplingLayer);
    const nextPageData = this.tablePaginator.nextPage(spLayer.contourn.coordinates.length, this.contournPointsPerPage,
      this.contournTableUpperIndex, spLayer.contourn.coordinates);
    this.datasetTableDataSource.data = nextPageData;
    this.contournTableUpperIndex = this.contournTableUpperIndex + this.contournPointsPerPage;
    this.contournTableUpperIndex = this.contournTableUpperIndex + nextPageData.length;
    this.actualContournTablePage = this.tablePaginator.calculateActualTablePage(spLayer.contourn.coordinates.length,
      this.contournPointsPerPage, this.contournTableUpperIndex, this.totalContournTablePages);
  }

}
