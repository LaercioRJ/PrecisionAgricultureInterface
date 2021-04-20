import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDWComponent } from '../IDW/idw/idw.component';
import { KrigingComponent } from '../Kriging/kriging/kriging.component';

import { Layer } from '../../../classes/layer';

import { LayerStorageService } from '../../../services/layer-storage.service';

@Component({
  selector: 'app-interpolation-switch',
  templateUrl: './interpolation-switch.component.html',
  styleUrls: ['./interpolation-switch.component.css']
})
export class InterpolationSwitchComponent implements OnInit {

  layer!: Layer;

  constructor(private activatedRoute: ActivatedRoute,
              private layerStorage: LayerStorageService) { }

  ngOnInit(): void {
    const layerIndex = this.activatedRoute.snapshot.paramMap.get('layerIndex');
    this.layer = this.layerStorage.getLayer(Number(layerIndex));
  }

}
