import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DatasetValue } from '../classes/datasetValue';

@Injectable({
  providedIn: 'root'
})
export class ServerConnectionService {

  constructor(private httpClient: HttpClient) { }

  private httpHeaders!: HttpHeaders;

  consumeRectification(kFormat: string, kSize: number, rectificationMethod: string, iteration: number, zmPoints: DatasetValue[]):
   Observable<object> {
    const url = 'https://adb.md.utfpr.edu.br/api/rectification/retify';

    this.httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

    return this.httpClient.post(url, {
      method: rectificationMethod,
      kernelSize: kSize,
      kernelFormat: kFormat,
      iterations: iteration,
      dataset: zmPoints
    },
    {
      headers: this.httpHeaders,
      responseType: 'json',
      observe: 'response'
    });
  }

  consumeIdwInterpolation(exponentIdw: number, neighborsIdw: number, radiusIdw: number, pixelX: number, pixelY: number,
                          layerDataset: DatasetValue[], layerContourn: number[][]): Observable<object> {
    const url = 'https://adb.md.utfpr.edu.br/api/interpolation/idw';

    this.httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

    return this.httpClient.post(url, {
      exponent: exponentIdw,
      neighbors: neighborsIdw,
      radius: radiusIdw,
      sizePixelX: pixelX,
      sizePixelY: pixelY,
      dataset: layerDataset,
      contourn: layerContourn
    },
    {
      headers: this.httpHeaders,
      responseType: 'json',
      observe: 'response'
    });
  }

  consumeIdwInterpolatorSelection(minExponent: number, maxExponent: number, exponentStep: number, minNeighbors: number,
                                  maxNeighbors: number, layerDataset: DatasetValue[]): Observable<object> {
    const url = 'https://adb.md.utfpr.edu.br/api/interpolation/isi/idw';

    this.httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

    return this.httpClient.post(url, {
      minimunExponent: minExponent,
      maximunExponent: maxExponent,
      stepExponent: exponentStep,
      minimunNeighbors: minNeighbors,
      maximunNeighbors: maxNeighbors,
      dataset: layerDataset
    },
    {
      headers: this.httpHeaders,
      responseType: 'json',
      observe: 'response'
    });
  }
}
