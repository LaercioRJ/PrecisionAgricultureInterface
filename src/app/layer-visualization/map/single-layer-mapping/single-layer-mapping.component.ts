import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { LayerStorageService } from '../../../services/layer-storage.service';
import { MappingService } from '../../../services/mapping.service';
import { MessageDeliveryService } from '../../../services/message-delivery.service';
import { NumberInputValidationService } from '../../../services/validation/number-input-validation.service';

import { GradientCustomizationComponent } from '../map-legend-customization/gradient-customization/gradient-customization.component';
import { IndividualColorCustomizationComponent } from '../map-legend-customization/individual-color-customization/individual-color-customization.component';
import { ZmMappingInfoComponent } from '../layer-info/zm-mapping-info/zm-mapping-info.component';

import { SamplingLayer } from '../../../classes/samplingLayer';
import { ZmLayer } from '../../../classes/zmLayer';
import { DatasetValue } from 'src/app/classes/datasetValue';

export interface LegendLine {
  lineName: string;
  lineColor: string;
}

@Component({
  selector: 'app-single-layer-mapping',
  templateUrl: './single-layer-mapping.component.html',
  styleUrls: ['./single-layer-mapping.component.css']
})
export class SingleLayerMappingComponent implements AfterViewInit, OnInit {

  alteredPointsId: number[] = [];
  contournExhibited = true;
  displayedColumns!: string[];
  hasContourn = false;
  isEditing = false;
  layer: any;
  layerType!: string;
  tableDataSource = new MatTableDataSource<LegendLine>();
  selectedPointId = -1;
  selectedPointFirstCoordinate = 0;
  selectedPointSecondCoordinate = 0;
  selectedPointData = 0;
  wasEdited = false;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private mapping: MappingService,
              private matDialog: MatDialog,
              private messageDelivery: MessageDeliveryService,
              private numberInputValidation: NumberInputValidationService) { }

  ngOnInit(): void {
    this.getLayer();
    this.mapping.renderCompleteMap(this.layer.dataset, 'fullMap', this.layer.classesColors, this.layerType);
    this.renderLegend();
    this.verifyContourn();
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < (this.layer.classesColors.rgbCodes.length) - 1; i++) {
      this.changeLegendVisualColor(i);
    }
  }

  getLayerIndex(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('layerIndex'));
  }

  getLayer(): void {
    const selectedlayer = this.layerStorage.getLayer(this.getLayerIndex());
    if (selectedlayer instanceof ZmLayer) {
      this.layerType = 'Zona de Manejo';
      this.layer = (selectedlayer as ZmLayer);
    } else {
      this.layerType = 'Pontos Amostrais';
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
      for (let i = 0; i < this.layer.classesColors.rgbCodes.length - 2; i++) {
        zmTableContent.push({lineName: String(i + 1), lineColor: ''});
      }
      zmTableContent.push({lineName: 'Seletor', lineColor: ''});
      this.tableDataSource.data = zmTableContent;
    }
  }

  verifyContourn(): void {
    if ((this.layerType === 'Pontos Amostrais') && (this.layer.contourn !== undefined)) {
      this.mapping.drawContourn(this.layer.contourn.coordinates, this.layer.classesColors);
      this.hasContourn = true;
    }
  }

  activateContourn(): void {
    if (this.contournExhibited) {
      // this.mapping.drawContourn(this.layer.contourn.coordinates, this.layer.classesColors);
      this.mapping.addPreviouslyDrawedContourn();
    } else {
      this.mapping.deleteContourn();
    }
  }

  changeLegendVisualColor(idNumber: number): void {
    const rgbCode = 'rgb(' + this.layer.classesColors.rgbCodes[idNumber][0].toString() + ', '
      + this.layer.classesColors.rgbCodes[idNumber][1].toString() + ', ' + this.layer.classesColors.rgbCodes[idNumber][2].toString() +
      ')';
    // tslint:disable-next-line: no-non-null-assertion
    document.getElementById('legendColor'.concat(String(idNumber)))!.style.background = rgbCode;
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
    const selectorColorClassIndex = this.layer.classesColors.rgbCodes.length - 2;
    this.mapping.changePointColor(chosenPointId, this.layer.classesColors.rgbCodes[selectorColorClassIndex]);
    this.selectedPointId = chosenPointId;
    this.selectedPointFirstCoordinate = this.layer.dataset[chosenPointId].coordinates[0];
    this.selectedPointSecondCoordinate = this.layer.dataset[chosenPointId].coordinates[1];
    this.selectedPointData = this.layer.dataset[chosenPointId].data;
  }

  unchooseSelectedPoint(): void {
    const pointOriginalColor = this.getPointClassColor(this.selectedPointData);
    this.mapping.changePointColor(this.selectedPointId, pointOriginalColor);
    this.selectedPointFirstCoordinate = 0;
    this.selectedPointSecondCoordinate = 0;
    this.selectedPointData = 0;
    this.selectedPointId = -1;
  }

  getPointClassColor(pointData: number): any {
    if (this.layerType === 'Pontos Amostrais') {
      return this.layer.classesColors.rgbCodes[0];
    } else {
      return this.layer.classesColors.rgbCodes[pointData - 1];
    }
  }

  chooseAnotherPoint(chosenPointId: number): void {
    this.unchooseSelectedPoint();
    this.chooseNewPoint(chosenPointId);
  }

  validateLayerDataEditing(): void {
    let dirtyForm = false;
    if (this.layerType === 'Zona de Manejo') {
      if (!this.numberInputValidation.isInteger(this.selectedPointData)) {
        this.messageDelivery.showMessage('Por favor, adicione apenas números inteiros !', 2200);
        dirtyForm = true;
      }
      if (!this.numberInputValidation.isWithinBounds(this.selectedPointData, 1, 10)) {
        this.messageDelivery.showMessage('Por favor, adicione apenas números maiores do que 0 ou menores que 11 !', 2500);
        dirtyForm = true;
      }
    }
    if (dirtyForm) {
      this.selectedPointData = this.layer.dataset[this.selectedPointId].data;
    } else {
      this.wasEdited = true;
      this.layer.dataset[this.selectedPointId].data = this.selectedPointData;
      this.alteredPointsId.push(this.selectedPointId);
    }
  }

  deleteEditingAlterations(): void {
    const layerIndex = this.getLayerIndex();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.alteredPointsId.length; i++) {
      const pointOldDataset = this.layerStorage.getLayerPoint(layerIndex, this.alteredPointsId[i]);
      this.layer.dataset[this.alteredPointsId[i]].data = pointOldDataset.data;
      if (this.layerType === 'Zona de Manejo') {
        const oldColor = this.getPointClassColor(pointOldDataset.data);
        this.mapping.changePointColor(this.alteredPointsId[i], oldColor);
      }
    }
    if (this.selectedPointId !== -1) {
      const selectorColorClassIndex = this.layer.classesColors.rgbCodes.length - 2;
      this.mapping.changePointColor(this.selectedPointId, this.layer.classesColors.rgbCodes[selectorColorClassIndex]);
      this.selectedPointData = this.layer.dataset[this.selectedPointId].data;
    }
    this.wasEdited = false;
    this.alteredPointsId = [];
    this.messageDelivery.showMessage('Todas as alterações foram desfeitas com sucesso !', 2200);
  }

  openGradientCustomization(): void {
    const rgbColors = this.layer.classesColors.rgbCodes;
    const dialogRef = this.matDialog.open(GradientCustomizationComponent, {
      width: '530px',
      data: { rgbColors },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.layer.classesColors.rgbCodes = result.colors;
        for (let i = 0; i < (this.layer.classesColors.rgbCodes.length - 2); i++) {
          this.changeLegendVisualColor(i);
        }
        this.mapping.changeAllPointsColor(this.layer.classesColors, this.layerType, this.layer.dataset);
        this.layerStorage.updateClassesColors(this.layer.classesColors, this.getLayerIndex());
      }
    });
  }

  openIndividualColorCustomization(structureTableIndex: number): void {
    let alteredStructureName;
    const rgbColorToAlter = this.layer.classesColors.rgbCodes[structureTableIndex];
    if (this.layer.classesColors.rgbCodes.length === (structureTableIndex + 1)) {
      alteredStructureName = 'do Seletor';
    } else {
      if (this.layerType === 'Zona de Manejo') {
        alteredStructureName = 'da Classe '.concat(String(structureTableIndex + 1));
      } else {
        alteredStructureName = 'do '.concat(this.tableDataSource.data[structureTableIndex].lineName);
      }
    }
    const dialogRef = this.matDialog.open(IndividualColorCustomizationComponent, {
      width: '530px',
      data: { alteredStructureName, rgbColorToAlter },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.layer.classesColors.rgbCodes[structureTableIndex] = result.data;
        this.changeLegendVisualColor(structureTableIndex);
        if (this.layerType === 'Pontos Amostrais') {
          switch (structureTableIndex) {
            case 0:
              this.mapping.changeAllPointsColor(this.layer.classesColors, this.layerType);
              break;
            case 1:
              this.mapping.changeContournColor(result.data);
              break;
            case 2:
              if (this.selectedPointId !== -1) {
                this.mapping.changePointColor(this.selectedPointId, result.data);
              }
              break;
          }
        } else {
          // tslint:disable-next-line: prefer-for-of
          const rgbCodesLength = this.layer.classesColors.rgbCodes.length;
          if (structureTableIndex !== (rgbCodesLength - 2)) {
            this.mapping.changeClassPointsColor((structureTableIndex + 1), result.data, this.layer.dataset);
            if ((this.selectedPointId !== -1) && ((structureTableIndex + 1) === this.selectedPointData)) {
              this.mapping.changePointColor(this.selectedPointId, this.layer.classesColors.rgbCodes[rgbCodesLength - 2]);
            }
          } else {
            this.mapping.changePointColor(this.selectedPointId, result.data);
          }
        }
        this.layerStorage.updateClassesColors(this.layer.classesColors, this.getLayerIndex());
      }
    });
  }

}
