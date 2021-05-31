import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MappingService } from '../../../services/mapping.service';
import { LayerStorageService } from '../../../services/layer-storage.service';

import { GradientCustomizationComponent } from '../map-legend-customization/gradient-customization/gradient-customization.component';

import { Layer } from '../../../classes/layer';
import { SamplingLayer } from '../../../classes/samplingLayer';
import { ZmLayer } from '../../../classes/zmLayer';

@Component({
  selector: 'app-single-layer-mapping',
  templateUrl: './single-layer-mapping.component.html',
  styleUrls: ['./single-layer-mapping.component.css']
})
export class SingleLayerMappingComponent implements OnInit {

  // TODO: fix choose and unchoose methods

  layer!: Layer;
  selectedPointId = -1;
  selectedPointFirstCoordinate = 0;
  selectedPointSecondCoordinate = 0;
  selectedPointData = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private mapping: MappingService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    const layerIndex = this.activatedRoute.snapshot.paramMap.get('layerIndex');
    this.layer = this.layerStorage.getLayer(Number(layerIndex));
    this.mapping.renderCompleteMap(this.layer.dataset, 'fullMap', this.layer.classesColors);
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
    this.mapping.changePointColor(chosenPointId, [0, 0, 0]);
    this.selectedPointId = chosenPointId;
    this.selectedPointFirstCoordinate = this.layer.dataset[chosenPointId].coordinates[0];
    this.selectedPointSecondCoordinate = this.layer.dataset[chosenPointId].coordinates[1];
    this.selectedPointData = this.layer.dataset[chosenPointId].data;
  }

  unchooseSelectedPoint(): void {
    const pointClass = this.layer.dataset[this.selectedPointId].data;
    this.mapping.changePointColor(this.selectedPointId, this.layer.classesColors.rgbCodes[pointClass - 1]);
    this.selectedPointFirstCoordinate = 0;
    this.selectedPointSecondCoordinate = 0;
    this.selectedPointData = 0;
    this.selectedPointId = -1;
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
