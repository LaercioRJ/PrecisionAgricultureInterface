import { Injectable } from '@angular/core';

import { ClassesColors } from '../classes/classesColors';
import { Contourn } from '../classes/contourn';
import { DatasetValue } from '../classes/datasetValue';

import Circle from 'ol/style/Circle';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import { Tile } from 'ol/layer';
import ScaleLine from 'ol/control/ScaleLine';
import { Stroke } from 'ol/style';
import { Style } from 'ol/style';
import { Vector } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';


@Injectable({
  providedIn: 'root'
})
export class MappingService {

  private map!: Map;

  private contournLayer!: Vector;
  private vectorLayer!: Vector;
  private vectorLayerFeatures: any[] = [];
  private vectorSource!: VectorSource;

  constructor() { }

  renderSimpleMap(centralLatitude: number, centralLongitude: number, mapId: string): void {
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

  renderCompleteMap(dataset: DatasetValue[], mapId: string, classesColors: ClassesColors, mapType: string): void {
    this.drawDataset(dataset, classesColors, mapType);
    this.vectorSource = new VectorSource({
      features: this.vectorLayerFeatures
    });

    this.vectorLayer = new Vector({
      source: this.vectorSource
    });

    this.map = new Map({
      target: mapId,
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric',
          minWidth: 100
        }),
        new FullScreen({
          tipLabel: 'Exibir em tela cheia'
        })
      ]),
      layers: [
        new Tile({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([dataset[0].coordinates[0], dataset[0].coordinates[1]]),
        zoom: 5,
        maxResolution: 120,
      })
    });
  }

  drawDataset(dataset: DatasetValue[], classesColors: any, mapType: string): void {
    const styles = this.createStyles(classesColors.rgbCodes, mapType);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < dataset.length; i++) {
      this.vectorLayerFeatures[i] = new Feature({
        geometry: new Point(fromLonLat([dataset[i].coordinates[0], dataset[i].coordinates[1]]))
      });
      let style: Style;
      if (mapType === 'Zona de Manejo') {
        style = styles[dataset[i].data - 1];
      } else {
        style = styles[0];
      }
      this.vectorLayerFeatures[i].setStyle(style);
      this.vectorLayerFeatures[i].setId(i);
    }
  }

  createStyles(classesColors: any, mapType: string): Style[] {
    const mapStyles: Style[] = [];
    let colorsQuantity: number;
    if (mapType === 'Zona de Manejo') {
      colorsQuantity = classesColors.length - 1;
    } else {
      colorsQuantity = 1;
    }
    for (let i = 0; i < colorsQuantity; i++) {
      mapStyles.push(new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: classesColors[i] })
        })
      }));
    }
    return mapStyles;
  }

  drawContourn(contournCoordinates: number[][], classesColors: any): void {
    const contournFeatures = [];
    const contournColor = classesColors.rgbCodes[1];
    const contournStyle = new Style({
      stroke: new Stroke({
        color: contournColor,
        width: 2
      })
    });
    for (let i = 0; i < (contournCoordinates.length - 1); i++) {
      const feature = new Feature({
        geometry: new LineString([fromLonLat(contournCoordinates[i]), fromLonLat(contournCoordinates[i + 1])])
      });
      feature.setStyle(contournStyle);
      contournFeatures.push(feature);
    }
    this.contournLayer = new Vector({
      source: new VectorSource({
        features: contournFeatures
      })
    });
    this.map.addLayer(this.contournLayer);
  }

  addPreviouslyDrawedContourn(): void {
    this.map.addLayer(this.contournLayer);
  }

  deleteContourn(): void {
    this.map.removeLayer(this.contournLayer);
  }

  getClickedPointId(clickEvent: any): any {
    const eventPixel = this.map.getEventPixel(clickEvent);
    return this.map.getFeaturesAtPixel(eventPixel)[0].getId();
  }

  changePointColor(pointId: number, newColorRgb: number[]): void {
    this.vectorLayerFeatures[pointId].setStyle(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({ color: newColorRgb })
      })
    }));
  }

}
