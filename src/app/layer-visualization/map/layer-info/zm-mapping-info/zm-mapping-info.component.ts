import { Component, Input, OnInit } from '@angular/core';

import { Layer } from '../../../../classes/layer';
import { ZmLayer } from '../../../../classes/zmLayer';

@Component({
  selector: 'app-zm-mapping-info',
  templateUrl: './zm-mapping-info.component.html',
  styleUrls: ['./zm-mapping-info.component.css']
})
export class ZmMappingInfoComponent implements OnInit {
  @Input() layer!: Layer;

  typedZmLayer!: ZmLayer;

  constructor() { }

  ngOnInit(): void {
    this.typedZmLayer = (this.layer as ZmLayer);
  }

}
