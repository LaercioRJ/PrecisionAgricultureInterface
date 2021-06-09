import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

@Component({
  selector: 'app-sp-mapping-info',
  templateUrl: './sp-mapping-info.component.html',
  styleUrls: ['./sp-mapping-info.component.css']
})
export class SpMappingInfoComponent implements OnInit {
  @Input() layer!: Layer;

  interpolationType = '';
  typedSPLayer!: SamplingLayer;

  constructor() { }

  ngOnInit(): void {
    this.typedSPLayer = (this.layer as SamplingLayer);
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
