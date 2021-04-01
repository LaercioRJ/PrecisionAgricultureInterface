import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

@Component({
  selector: 'app-sp-layer-info',
  templateUrl: './sp-layer-info.component.html',
  styleUrls: ['./sp-layer-info.component.css']
})
export class SpLayerInfoComponent implements OnInit {
  @Input() layer!: Layer;

  typedSPLayer!: SamplingLayer;
  interpolationType = '';

  constructor() { }

  ngOnInit(): void {
    this.typedSPLayer = (this.layer as SamplingLayer);
    this.identifyInterpolationType();
  }

  identifyInterpolationType(): void {
    if (this.typedSPLayer.idwExpoent !== 0) {
      this.interpolationType = 'IDW';
    } else {
      if (this.typedSPLayer.krigingMethod !== '') {
        this.interpolationType = 'Krigagem';
      }
    }
  }

}
