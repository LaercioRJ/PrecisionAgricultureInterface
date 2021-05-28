import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../classes/layer';
import { SamplingLayer } from '../../classes/samplingLayer';

import { MappingService } from '../../services/mapping.service';

@Component({
  selector: 'app-layer-card',
  templateUrl: './layer-card.component.html',
  styleUrls: ['./layer-card.component.css']
})
export class LayerCardComponent implements OnInit {
  @Input() layerId!: string;
  @Input() layer!: Layer;

  layerDatasetLengthDisplay = '';
  layerType = 'Layer de Zona de Manejo';

  constructor(private mapping: MappingService) { }

  ngOnInit(): void {
    this.layerDatasetLengthDisplay = String(this.layer.datasetLength).concat(' pontos');
    this.confirmLayerType();
    const mapClass = 'mapCard'.concat(this.layerId);
    this.changeMapDivClass(mapClass);
    this.mapping.renderSimpleMap(this.layer.dataset[0].coordinates[0], this.layer.dataset[0].coordinates[1], mapClass);
  }

  private confirmLayerType(): void {
    if (this.layer instanceof SamplingLayer) {
      this.layerType = 'Layer de Pontos Amostrais';
    }
  }

  private changeMapDivClass(newClass: string): void {
    const mapDiv = document.getElementById('mapCard');
    if (mapDiv !== null) {
      mapDiv.id = newClass;
    }
  }

}
