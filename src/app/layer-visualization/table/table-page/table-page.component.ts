import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LayerStorageService } from '../../../services/layer-storage.service';

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
    // tslint:disable-next-line: deprecation
    this.activatedRoute.paramMap.subscribe(parameters => {
      this.layer = this.layerStorage.getLayer(Number(parameters.get('layerIndex')));
      if (this.layer instanceof ZmLayer) {
        this.layerType = 'Zona de Manejo';
      } else {
        this.layerType = 'Pontos Amostrais';
      }
    });
  }

}
