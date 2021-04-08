import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DatasetValue } from '../classes/datasetValue';
import { Observable } from 'rxjs';

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
}
