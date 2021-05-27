import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MappingService } from '../../../services/mapping.service';
import { LayerStorageService } from '../../../services/layer-storage.service';

import { Layer } from '../../../classes/layer';
import { SamplingLayer } from '../../../classes/samplingLayer';
import { ZmLayer } from '../../../classes/zmLayer';

@Component({
  selector: 'app-single-layer-mapping',
  templateUrl: './single-layer-mapping.component.html',
  styleUrls: ['./single-layer-mapping.component.css']
})
export class SingleLayerMappingComponent implements OnInit {

  layer?: Layer;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService,
              private mapping: MappingService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    const layerIndex = this.activatedRoute.snapshot.paramMap.get('layerIndex');
    this.layer = this.layerStorage.getLayer(Number(layerIndex));
    this.mapping.RenderSimpleMap(this.layer.dataset[0].coordinates[0], this.layer.dataset[0].coordinates[1], 'map');
  }

}
