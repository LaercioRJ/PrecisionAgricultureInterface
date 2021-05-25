import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DatasetValue } from '../../../../classes/datasetValue';
import { Layer } from '../../../../classes/layer';

import { TablePaginatorService } from '../../../../services/table-paginator.service';

@Component({
  selector: 'app-mz-table',
  templateUrl: './mz-table.component.html',
  styleUrls: ['./mz-table.component.css']
})
export class MzTableComponent implements OnInit {
  @Input() layer!: Layer;

  actualTablePage = 0;
  datasetTableDataSource = new MatTableDataSource<DatasetValue>();
  datasetDisplayedColumns!: string[];
  tableLowerIndex = 0;
  tableUpperIndex = 20;
  totalTablePages = 0;

  constructor(private tablePaginator: TablePaginatorService) { }

  ngOnInit(): void {
    this.totalTablePages = this.tablePaginator.calculateTotalTablePages(this.layer.datasetLength, 20);
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, 20, this.tableUpperIndex,
      this.totalTablePages);
    this.datasetDisplayedColumns = ['Identificador', this.layer.latitudeHeader, this.layer.longitudeHeader, this.layer.dataHeader];
    for (let i = 0; i < 20; i++) {
      this.datasetTableDataSource.data.push(this.layer.dataset[i]);
    }
  }

  tableNextPage(): void {
    const nextPageData = this.tablePaginator.nextPage(this.layer.datasetLength, 20, this.tableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = nextPageData;
    this.tableLowerIndex = this.tableLowerIndex + 20;
    this.tableUpperIndex = this.tableUpperIndex + nextPageData.length;
    this.actualTablePage = this.tablePaginator.calculateActualTablePage(this.layer.datasetLength, 20, this.tableUpperIndex,
      this.totalTablePages);
  }

  tablePreviousPage(): void {
    const newUpperIndex = this.tableUpperIndex - this.datasetTableDataSource.data.length;
    const previousPageData = this.tablePaginator.previousPage(this.layer.datasetLength, 20, this.tableUpperIndex, this.layer.dataset);
    this.datasetTableDataSource.data = previousPageData;
    this.tableUpperIndex = newUpperIndex;
    this.tableLowerIndex = this.tableLowerIndex - 20;
  }

}
