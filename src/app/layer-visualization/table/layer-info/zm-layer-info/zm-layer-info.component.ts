import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../../../classes/layer';
import { ZmLayer } from '../../../../classes/zmLayer';

@Component({
  selector: 'app-zm-layer-info',
  templateUrl: './zm-layer-info.component.html',
  styleUrls: ['./zm-layer-info.component.css']
})
export class ZmLayerInfoComponent implements OnInit {
  @Input() layer!: Layer;

  typedZmLayer!: ZmLayer;

  constructor() { }

  ngOnInit(): void {
    this.typedZmLayer = (this.layer as ZmLayer);
    this.typedZmLayer.iterations = 5;
    this.typedZmLayer.kernelFormat = 'Retangular';
    this.typedZmLayer.kernelSize = '5X5';
    this.typedZmLayer.rectificationMethod = 'Aberto';
  }

}
