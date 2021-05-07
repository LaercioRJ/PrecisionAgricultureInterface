import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { KrigingSelectorResult } from '../../../../classes/krigingSelectorResult';

@Component({
  selector: 'app-kriging-parameters-table',
  templateUrl: './kriging-parameters-table.component.html',
  styleUrls: ['./kriging-parameters-table.component.css']
})
export class KrigingParametersTableComponent implements OnChanges {
  @Input() tableContent!: KrigingSelectorResult;

  displayedColumns = ['isi', 'method', 'model', 'nuggetEffect', 'range', 'partialSill'];
  dataSource = new MatTableDataSource<KrigingSelectorResult>();

  constructor() { }

  ngOnChanges(): void {
    this.dataSource.data = [this.tableContent];
  }

}
