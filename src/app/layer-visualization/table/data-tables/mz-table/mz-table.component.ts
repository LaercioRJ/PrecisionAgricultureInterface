import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';

import { LayerStorageService } from '../../../../services/layer-storage.service';
import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { NumberInputValidationService } from '../../../../services/validation/number-input-validation.service';
import { TablePaginatorService } from '../../../../services/table-paginator.service';

@Component({
  selector: 'app-mz-table',
  templateUrl: './mz-table.component.html',
  styleUrls: ['./mz-table.component.css']
})
export class MzTableComponent implements OnInit {
  @Input() layer!: Layer;

  alteredpointsId: number[] = [];
  actualTablePage = 1;
  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  datasetDisplayedColumns!: string[];
  isEditing = false;
  linesPerPage = 20;
  tableLowerIndex = (this.linesPerPage * -1);
  tableUpperIndex = 0;
  totalTablePages = 0;
  wasEdited = false;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private messageDelivery: MessageDeliveryService,
              private numberValidation: NumberInputValidationService,
              private tablePaginator: TablePaginatorService) { }

  ngOnInit(): void {
    this.totalTablePages = this.tablePaginator.calculateTotalTablePages(this.layer.datasetLength, this.linesPerPage);
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    this.tableNextPage();
  }

  editTableData(event: any, tablePointIndex: number): void {
    let dirtForm = false;
    const newInput = Number(event.target.value);

    if (!this.numberValidation.isInteger(newInput)) {
      this.messageDelivery.showMessage('Por favor, adicione apenas números inteiros !', 2200);
      dirtForm = true;
    }
    if (!this.numberValidation.isWithinBounds(newInput, 1, 10)) {
      this.messageDelivery.showMessage('Por favor, adicione apenas números maiores do que 0 ou menores que 11 !', 2500);
      dirtForm = true;
    }

    if (dirtForm) {
      event.target.value = this.layer.dataset[tablePointIndex + this.tableLowerIndex].data;
    } else {
      this.wasEdited = true;
      this.layer.dataset[tablePointIndex + this.tableLowerIndex].data = Number(event.target.value);
      this.alteredpointsId.push(tablePointIndex + this.tableLowerIndex);
    }
  }

  deleteAlterations(): void {
    const layerIndex = Number(this.activatedRoute.snapshot.paramMap.get('layerIndex'));

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.alteredpointsId.length; i++) {
      const pointOldDataset = this.layerStorage.getLayerPoint(layerIndex, this.alteredpointsId[i]);
      this.layer.dataset[this.alteredpointsId[i]].data = pointOldDataset.data;
    }

    for (let i = 0; i < this.linesPerPage; i++ ) {
      this.datasetTableDataSource.data[i].data = this.layer.dataset[i].data;
    }

    this.wasEdited = false;
    this.alteredpointsId = [];
    this.messageDelivery.showMessage('Todas as alterações foram desfeitas com sucesso !', 2200);
  }

  tableNextPage(): void {
    const nextPageData = this.tablePaginator.nextPage(this.layer.datasetLength, this.linesPerPage, this.tableUpperIndex,
      this.layer.dataset);
    this.datasetTableDataSource.data = nextPageData;
    this.tableLowerIndex = this.tableLowerIndex + this.linesPerPage;
    this.tableUpperIndex = this.tableUpperIndex + nextPageData.length;
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.totalTablePages);
  }

  tableNextTenPages(): void {
    const nextData = this.tablePaginator.nextTenPages(this.layer.datasetLength, this.linesPerPage, this.tableUpperIndex,
      this.layer.dataset);
    this.datasetTableDataSource.data = nextData;
    this.tableLowerIndex = this.tableLowerIndex + (this.linesPerPage * 10);
    this.tableUpperIndex = nextData.length + this.tableLowerIndex;
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.totalTablePages);
  }

  tablePreviousPage(): void {
    const newUpperIndex = this.tableUpperIndex - this.datasetTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.tableUpperIndex = newUpperIndex;
    this.tableLowerIndex = this.tableLowerIndex - this.linesPerPage;
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.totalTablePages);
  }

  tablePreviousTenPages(): void {
    const newUpperIndex = this.tableUpperIndex - (this.linesPerPage * 10);
    const previousPageData = this.tablePaginator.previousTenPages(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.tableUpperIndex = newUpperIndex;
    this.tableLowerIndex = this.tableLowerIndex - (this.linesPerPage * 10);
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, this.linesPerPage,
      this.tableUpperIndex, this.totalTablePages);
  }

}
