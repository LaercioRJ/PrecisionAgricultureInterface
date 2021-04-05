import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Layer } from '../../classes/layer';

import { LayerStorageService } from '../../services/layer-storage.service';

@Component({
  selector: 'app-rectification',
  templateUrl: './rectification.component.html',
  styleUrls: ['./rectification.component.css']
})
export class RectificationComponent implements OnInit {

  customIteration = 7;
  customIterationPreviousValue = 7;
  iterations: number[] = [1, 2, 3, 4, 5, 6];
  kernelFormats: string[] = ['Retangular', 'Elipse', 'Cruz'];
  kernelSizes: string[] = ['3X3', '5X5', '7X7', '9X9', '11X11'];
  rectificationMethods: string[] = ['Mediana', 'Aberto', 'Fechado', 'Aberto e Fechado'];
  selectedKernelFormat = 'Retangular';
  selectedKernelSize = '3X3';
  selectedIteration = 1;
  selectedRectificationMethod = 'Mediana';

  layer!: Layer;

  loadBarState = 'none';

  constructor(private layerStorage: LayerStorageService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.activatedRoute.paramMap.subscribe(parameters => {
      this.layer = this.layerStorage.getLayer(Number(parameters.get('layerIndex')));
    });
  }

  executeRectification(): void {
    let kFormat: string;
    let kSize: number;
    let rMethod: string;
    let iteration: number;
    this.loadBarState = 'block';

    switch (this.selectedKernelFormat) {
      case 'Retangular':
        kFormat = 'rect';
        break;
      case 'Elipse':
        kFormat = 'ellipse';
        break;
      case 'Cruz':
        kFormat = 'cross';
        break;
    }

    switch (this.selectedKernelSize) {
      case '3X3':
        kSize = 3;
        break;
      case '5X5':
        kSize = 5;
        break;
      case '7X7':
        kSize = 7;
        break;
      case '9X9':
        kSize = 9;
        break;
      case '11X11':
        kSize = 11;
        break;
    }

    switch (this.selectedRectificationMethod) {
      case 'Mediana':
        rMethod = 'median';
        break;
      case 'Aberto':
        rMethod = 'open';
        break;
      case 'Fechado':
        rMethod = 'close';
        break;
      case 'Aberto e Fechado':
        rMethod = 'openandclose';
        break;
    }

    if (Number(this.selectedIteration) === 7) {
      iteration = this.customIteration;
    } else {
      iteration = Number(this.selectedIteration);
    }
  }

}
