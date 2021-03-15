import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../classes/layer';

import { MappingService } from '../../services/mapping.service';

@Component({
  selector: 'app-layer-card',
  templateUrl: './layer-card.component.html',
  styleUrls: ['./layer-card.component.css']
})
export class LayerCardComponent implements OnInit {
  @Input() layerId!: string;
  @Input() layer!: Layer;

  constructor(private mapping: MappingService) { }

  ngOnInit(): void {
    const mapClass = 'map'.concat(this.layerId);
    this.changeMapDivClass(mapClass);
    this.mapping.RenderSimpleMap(this.layer.dataset[0].coordinates[0], this.layer.dataset[0].coordinates[1], mapClass);
  }

  changeMapDivClass(newClass: string): void {
    const mapDiv = document.getElementById('map');
    if (mapDiv !== null) {
      mapDiv.id = newClass;
    }
  }

}
