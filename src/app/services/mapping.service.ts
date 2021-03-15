import { Injectable } from '@angular/core';

import Circle from 'ol/style/Circle';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import { Tile } from 'ol/layer';
import ScaleLine from 'ol/control/ScaleLine';
import { Style } from 'ol/style';
import { Vector } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';


@Injectable({
  providedIn: 'root'
})
export class MappingService {

  private vectorSource!: VectorSource;
  private vectorLayerFeatures = [];
  private vectorLayer!: Vector;

  private map!: Map;

  constructor() { }

  RenderSimpleMap(centralLatitude: number, centralLongitude: number, mapId: string): void {
    this.map = new Map({
      target: mapId,
      controls: [],
      interactions: [],
      layers: [
        new Tile({
          source: new OSM()
        }),
      ],
      view: new View({
        center: fromLonLat([centralLatitude, centralLongitude]),
        zoom: 0,
        maxResolution: 190
      })
    });
  }
}
