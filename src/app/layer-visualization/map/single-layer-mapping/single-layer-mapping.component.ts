import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MappingService } from '../../../services/mapping.service';
import { LayerStorageService } from '../../../services/layer-storage.service';

import { GradientCustomizationComponent } from '../map-legend-customization/gradient-customization/gradient-customization.component';
import { ZmMappingInfoComponent } from '../layer-info/zm-mapping-info/zm-mapping-info.component';

import { ClassesColors } from '../../../classes/classesColors';
import { SamplingLayer } from '../../../classes/samplingLayer';
import { ZmLayer } from '../../../classes/zmLayer';

export interface LegendLine {
  lineName: string;
  lineColor: string;
}

@Component({
  selector: 'app-single-layer-mapping',
  templateUrl: './single-layer-mapping.component.html',
  styleUrls: ['./single-layer-mapping.component.css']
})
export class SingleLayerMappingComponent implements OnInit {

  displayedColumns!: string[];
  layer: any;
  layerType!: string;
  tableDataSource = new MatTableDataSource<LegendLine>();
  selectedPointId = -1;
  selectedPointFirstCoordinate = 0;
  selectedPointSecondCoordinate = 0;
  selectedPointData = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private mapping: MappingService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    const layerIndex = Number(this.activatedRoute.snapshot.paramMap.get('layerIndex'));
    this.getLayer(layerIndex);
    this.mapping.renderCompleteMap(this.layer.dataset, 'fullMap', this.layer.classesColors, this.layerType);
    this.renderLegend();
    this.changeLegendVisualColor(0);
  }

  getLayer(layerIndex: number): void {
    const selectedlayer = this.layerStorage.getLayer(layerIndex);
    if (selectedlayer instanceof ZmLayer) {
      this.layerType = 'Zona de Manejo';
      const classesQuantity  = (selectedlayer as ZmLayer).discoverHigherClass();
      selectedlayer.classesColors = new ClassesColors(classesQuantity);
      this.layer = (selectedlayer as ZmLayer);
    } else {
      this.layerType = 'Pontos Amostrais';
      selectedlayer.classesColors = new ClassesColors(2);
      this.layer = (selectedlayer as SamplingLayer);
    }
  }

  renderLegend(): void {
    if (this.layerType === 'Pontos Amostrais') {
      this.displayedColumns = ['Dado', 'Cor'];
      const spTableContent: LegendLine[] = [
        {lineName: 'Ponto', lineColor: ''},
        {lineName: 'Contorno', lineColor: ''},
        {lineName: 'Seletor', lineColor: ''}
      ];
      this.tableDataSource.data = spTableContent;
    } else {
      this.displayedColumns = ['Classe', 'Cor'];
      const zmTableContent: LegendLine[] = [];
      for (let i = 0; i < this.layer.classesColors.rgbCodes.length; i++) {
        zmTableContent.push({lineName: String(i + 1), lineColor: ''});
      }
      zmTableContent.push({lineName: 'Seletor', lineColor: ''});
      this.tableDataSource.data = zmTableContent;
    }
  }

  changeLegendVisualColor(idNumber: number): void {
    const rgbCode = 'rgb(' + this.layer.classesColors.rgbCodes[idNumber][0].toString() + ', '
      + this.layer.classesColors.rgbCodes[idNumber][1].toString() + ', ' + this.layer.classesColors.rgbCodes[idNumber][2].toString() +
      ')';
    const foo = document.getElementById('legendColor0');
    console.log(foo);
    // tslint:disable-next-line: no-non-null-assertion
    document.getElementById('legendColor0')!.style.background = rgbCode;
  }

  selectPoint(clickEvent: any): void {
    try{
      const clickedPointId = Number(this.mapping.getClickedPointId(clickEvent));
      if (this.selectedPointId === -1) {
        // There wasnt a chosen point
        this.chooseNewPoint(clickedPointId);
      } else {
        if (clickedPointId === this.selectedPointId) {
          // this point was already selected
          this.unchooseSelectedPoint();
        } else {
          // the user chose a point different from the one already selected
          this.chooseAnotherPoint(clickedPointId);
        }
      }
    } catch (error) {
      // there will be an error if the user does not click a point, ignore this error
    }
  }

  chooseNewPoint(chosenPointId: number): void {
    this.mapping.changePointColor(chosenPointId, this.layer.classesColors[this.layer.classesColors.length]);
    this.selectedPointId = chosenPointId;
    this.selectedPointFirstCoordinate = this.layer.dataset[chosenPointId].coordinates[0];
    this.selectedPointSecondCoordinate = this.layer.dataset[chosenPointId].coordinates[1];
    this.selectedPointData = this.layer.dataset[chosenPointId].data;
  }

  unchooseSelectedPoint(): void {
    const pointOriginalColor = this.getPointClassColor();
    this.mapping.changePointColor(this.selectedPointId, pointOriginalColor);
    this.selectedPointFirstCoordinate = 0;
    this.selectedPointSecondCoordinate = 0;
    this.selectedPointData = 0;
    this.selectedPointId = -1;
  }

  getPointClassColor(): any {
    if (this.layerType === 'Zona de Manejo') {
      const pointData = this.layer.dataset[this.selectedPointId].data;
      return this.layer.classesColors.rgbCodes[pointData - 1];
    } else {
      return this.layer.classesColors.rgbCodes[0];
    }
  }

  chooseAnotherPoint(chosenPointId: number): void {
    this.unchooseSelectedPoint();
    this.chooseNewPoint(chosenPointId);
  }

  openGradientCustomization(): void {
    const dialogRef = this.matDialog.open(GradientCustomizationComponent, {
      width: '530px',
    });
  }

}
