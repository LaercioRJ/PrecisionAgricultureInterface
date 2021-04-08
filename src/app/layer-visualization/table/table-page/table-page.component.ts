import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LayerStorageService } from '../../../services/layer-storage.service';

import { SpTableComponent } from '../data-tables/sp-table/sp-table.component';

import { Layer } from '../../../classes/layer';
import { ZmLayer } from '../../../classes/zmLayer';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css']
})
export class TablePageComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService) { }

  layer!: Layer;
  layerType!: string;

  ngOnInit(): void {
    const layerIndex = this.activatedRoute.snapshot.paramMap.get('layerIndex');
    this.layer = this.layerStorage.getLayer(Number(layerIndex));
    if (this.layer instanceof ZmLayer) {
      this.layerType = 'Zona de Manejo';
    } else {
      this.layerType = 'Pontos Amostrais';
    }
  }

}
