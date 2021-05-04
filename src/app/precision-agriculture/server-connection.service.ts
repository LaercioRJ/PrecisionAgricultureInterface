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

  krigingCutoff?: number;
  krigingPairs?: number;
  krigingAutoLags?: boolean;
  krigingAmoutLags?: number;

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

  // TODO: generalizar esta função
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
      dataset: [ {
        "coordinates": [
            197730.7244,
            7186660.342
        ],
        "data": 350.365
    },
    {
        "coordinates": [
            197748.3489,
            7186705.094
        ],
        "data": 350.56
    },
    {
        "coordinates": [
            197761.8696,
            7186739.774
        ],
        "data": 350.327
    },
    {
        "coordinates": [
            197727.4649,
            7186764.836
        ],
        "data": 353.464
    },
    {
        "coordinates": [
            197716.3926,
            7186822.692
        ],
        "data": 355.62
    },
    {
        "coordinates": [
            197689.5218,
            7186777.066
        ],
        "data": 357.107
    },
    {
        "coordinates": [
            197688.8638,
            7186730.256
        ],
        "data": 355.756
    },
    {
        "coordinates": [
            197674.8941,
            7186688.691
        ],
        "data": 355.556
    },
    {
        "coordinates": [
            197606.3155,
            7186652.55
        ],
        "data": 359.45
    },
    {
        "coordinates": [
            197624.8466,
            7186688.34
        ],
        "data": 359.448
    },
    {
        "coordinates": [
            197642.0349,
            7186730.089
        ],
        "data": 359.326
    },
    {
        "coordinates": [
            197652.4647,
            7186763.368
        ],
        "data": 359.148
    },
    {
        "coordinates": [
            197677.6998,
            7186810.066
        ],
        "data": 358.567
    },
    {
        "coordinates": [
            197698.6223,
            7186860.437
        ],
        "data": 358.427
    },
    {
        "coordinates": [
            197737.2604,
            7186888.918
        ],
        "data": 358.273
    },
    {
        "coordinates": [
            197778.3739,
            7186950.611
        ],
        "data": 362.496
    },
    {
        "coordinates": [
            197726.0941,
            7186942.004
        ],
        "data": 362.027
    },
    {
        "coordinates": [
            197670.4401,
            7186895.398
        ],
        "data": 361.121
    },
    {
        "coordinates": [
            197655.9927,
            7186843.731
        ],
        "data": 360.662
    },
    {
        "coordinates": [
            197623.5164,
            7186792.102
        ],
        "data": 362.241
    },
    {
        "coordinates": [
            197599.695,
            7186740.778
        ],
        "data": 362.876
    },
    {
        "coordinates": [
            197564.7002,
            7186689.203
        ],
        "data": 363.263
    },
    {
        "coordinates": [
            197524.5075,
            7186644.829
        ],
        "data": 363.197
    },
    {
        "coordinates": [
            197547.1711,
            7186582.134
        ],
        "data": 361.147
    },
    {
        "coordinates": [
            197522.8722,
            7186529.69
        ],
        "data": 364.702
    },
    {
        "coordinates": [
            197497.7364,
            7186483.105
        ],
        "data": 367.596
    },
    {
        "coordinates": [
            197430.7926,
            7186508.542
        ],
        "data": 367.23
    },
    {
        "coordinates": [
            197460.1593,
            7186559.547
        ],
        "data": 365.481
    },
    {
        "coordinates": [
            197413.4477,
            7186581.005
        ],
        "data": 365.216
    },
    {
        "coordinates": [
            197391.8321,
            7186530.174
        ],
        "data": 365.842
    },
    {
        "coordinates": [
            197337.2087,
            7186554.114
        ],
        "data": 363.288
    },
    {
        "coordinates": [
            197371.1219,
            7186600.01
        ],
        "data": 363.266
    },
    {
        "coordinates": [
            197420.0477,
            7186636.709
        ],
        "data": 365.277
    },
    {
        "coordinates": [
            197483.9662,
            7186665.095
        ],
        "data": 365.769
    },
    {
        "coordinates": [
            197507.1715,
            7186707.978
        ],
        "data": 366.84
    },
    {
        "coordinates": [
            197446.0558,
            7186707.155
        ],
        "data": 367.953
    },
    {
        "coordinates": [
            197486.9753,
            7186763.965
        ],
        "data": 369.618
    },
    {
        "coordinates": [
            197536.5515,
            7186758.429
        ],
        "data": 367.251
    },
    {
        "coordinates": [
            197511.4735,
            7186816.523
        ],
        "data": 369.836
    },
    {
        "coordinates": [
            197566.5465,
            7186812.885
        ],
        "data": 366.811
    },
    {
        "coordinates": [
            197591.684,
            7186863.906
        ],
        "data": 366.172
    },
    {
        "coordinates": [
            197598.5705,
            7186911.41
        ],
        "data": 366.845
    },
    {
        "coordinates": [
            197625.231,
            7186948.493
        ],
        "data": 366.463
    },
    {
        "coordinates": [
            197644.6952,
            7186978.649
        ],
        "data": 366.249
    },
    {
        "coordinates": [
            197672.8385,
            7187003.568
        ],
        "data": 366.709
    },
    {
        "coordinates": [
            197711.5859,
            7187022.737
        ],
        "data": 367.3
    },
    {
        "coordinates": [
            197740.1784,
            7187000.87
        ],
        "data": 366.055
    },
    {
        "coordinates": [
            197772.5374,
            7187026.438
        ],
        "data": 367.35
    },
    {
        "coordinates": [
            197802.3412,
            7187008.923
        ],
        "data": 365.817
    },
    {
        "coordinates": [
            197828.7551,
            7187030.143
        ],
        "data": 366.592
    },
    {
        "coordinates": [
            197753.6698,
            7187077.132
        ],
        "data": 369.844
    },
    {
        "coordinates": [
            197721.4557,
            7187098.806
        ],
        "data": 370.678
    },
    {
        "coordinates": [
            197746.7866,
            7187141.292
        ],
        "data": 371.355
    },
    {
        "coordinates": [
            197778.9609,
            7187121.391
        ],
        "data": 371.134
    },
    {
        "coordinates": [
            197814.2832,
            7187100.342
        ],
        "data": 370.426
    },
    {
        "coordinates": [
            197849.6602,
            7187076.853
        ],
        "data": 368.826
    },
    {
        "coordinates": [
            197870.4064,
            7187108.258
        ],
        "data": 370.276
    },
    {
        "coordinates": [
            197832.4976,
            7187132.355
        ],
        "data": 371.267
    },
    {
        "coordinates": [
            197799.0331,
            7187155.886
        ],
        "data": 371.609
    },
    {
        "coordinates": [
            197772.8439,
            7187178.361
        ],
        "data": 371.5
    },
    {
        "coordinates": [
            197793.487,
            7187209.874
        ],
        "data": 371.517
    },
    {
        "coordinates": [
            197820.7893,
            7187191.638
        ],
        "data": 372.127
    },
    {
        "coordinates": [
            197851.8712,
            7187171.047
        ],
        "data": 372.258
    },
    {
        "coordinates": [
            197888.5262,
            7187144.483
        ],
        "data": 371.69
    },
    {
        "coordinates": [
            197906.903,
            7187169.291
        ],
        "data": 372.58
    },
    {
        "coordinates": [
            197872.6516,
            7187196.464
        ],
        "data": 372.866
    },
    {
        "coordinates": [
            197841.6304,
            7187218.831
        ],
        "data": 372.322
    },
    {
        "coordinates": [
            197816.0453,
            7187241.32
        ],
        "data": 371.528
      }],
      contourn: [
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197894.97388362233, 7186696.86216918 ],
        [ 197895.3790338165, 7186696.760399617 ],
        [ 197895.3790338165, 7186696.760399617 ],
        [ 197895.27836987085, 7186696.758134049 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.4747089466, 7186696.98432886 ],
        [ 197895.57537289313, 7186696.986594426 ],
        [ 197895.57537289313, 7186696.986594426 ],
        [ 197895.47720335406, 7186696.873497022 ],
        [ 197895.37653940823, 7186696.871231455 ],
        [ 197895.37653940823, 7186696.871231455 ],
        [ 197895.37653940823, 7186696.871231455 ],
        [ 197895.3740449999, 7186696.982063293 ],
        [ 197895.27338105254, 7186696.9797977265 ],
        [ 197895.27338105254, 7186696.9797977265 ],
        [ 197895.27338105254, 7186696.9797977265 ],
        [ 197894.86823085212, 7186697.0815672865 ],
        [ 197891.08629256557, 7186699.546872975 ],
        [ 197887.5056808095, 7186702.0167089775 ],
        [ 197884.12140672497, 7186704.712739132 ],
        [ 197880.53330866643, 7186707.515069069 ],
        [ 197876.7488700563, 7186710.091203099 ],
        [ 197872.76060719613, 7186712.773636602 ],
        [ 197867.1567277375, 7186715.641480636 ],
        [ 197864.09190083004, 7186717.568480747 ],
        [ 197858.69932428363, 7186719.9975257525 ],
        [ 197853.80757171038, 7186722.548729952 ],
        [ 197852.16700812237, 7186723.842458446 ],
        [ 197846.64631970262, 7186727.488383727 ],
        [ 197839.60568515497, 7186731.543645187 ],
        [ 197831.9460910295, 7186736.250298539 ],
        [ 197825.3081042074, 7186740.3146174075 ],
        [ 197818.56944879075, 7186744.376667272 ],
        [ 197811.92646337696, 7186748.662644073 ],
        [ 197805.28097843158, 7186753.059449881 ],
        [ 197799.94911737024, 7186757.264050189 ],
        [ 197792.61394353205, 7186760.97999546 ],
        [ 197784.04583826096, 7186765.777059964 ],
        [ 197777.69733802142, 7186770.402316657 ],
        [ 197769.64003000158, 7186774.878209274 ],
        [ 197762.68753214448, 7186779.489861046 ],
        [ 197755.73752478365, 7186783.990677757 ],
        [ 197749.60031705943, 7186788.177128319 ],
        [ 197741.35912736988, 7186791.872649222 ],
        [ 197733.6012915756, 7186796.466154493 ],
        [ 197728.02064171364, 7186802.7720033545 ],
        [ 197730.335115031, 7186811.806058101 ],
        [ 197734.57969653275, 7186820.107355631 ],
        [ 197739.74773823214, 7186827.653227518 ],
        [ 197744.61129529477, 7186835.303128907 ],
        [ 197750.18200982612, 7186842.858061851 ],
        [ 197754.6528999522, 7186850.055564517 ],
        [ 197759.62712149898, 7186857.264397494 ],
        [ 197764.61382530397, 7186863.919068522 ],
        [ 197769.37175561563, 7186871.788355277 ],
        [ 197773.76445873984, 7186877.986095928 ],
        [ 197778.89262467617, 7186887.305258064 ],
        [ 197783.35356668715, 7186894.946075337 ],
        [ 197787.6306487015, 7186901.806534927 ],
        [ 197793.5133951549, 7186908.924915282 ],
        [ 197797.48100546323, 7186916.111067783 ],
        [ 197802.47773209587, 7186922.322392764 ],
        [ 197807.34385898826, 7186929.861431742 ],
        [ 197811.29401997384, 7186937.823401677 ],
        [ 197815.87063473737, 7186944.80147904 ],
        [ 197820.81000201573, 7186953.561927764 ],
        [ 197825.69361522177, 7186960.325134702 ],
        [ 197830.1421387882, 7186968.520089949 ],
        [ 197835.106471889, 7186976.172212934 ],
        [ 197839.7987475423, 7186982.487554057 ],
        [ 197844.5642541672, 7186990.024308993 ],
        [ 197849.43043277308, 7186997.5633273255 ],
        [ 197853.59943652095, 7187004.753988268 ],
        [ 197858.24932726775, 7187012.9534618985 ],
        [ 197862.9092016011, 7187020.709605988 ],
        [ 197867.77041466924, 7187028.470278905 ],
        [ 197872.74227729515, 7187035.789887658 ],
        [ 197876.28486015688, 7187043.964432225 ],
        [ 197882.07703186054, 7187050.637169054 ],
        [ 197886.22611944593, 7187058.714470454 ],
        [ 197890.38020070933, 7187066.5701064 ],
        [ 197894.26470944943, 7187072.97813128 ]
      ]
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

  consumeKrigingInterpolationSelection(AmountLags: number, Cutoff: number, Pairs: number, rangeIntervals: number,
                                       partialSill: number, layerDataset: DatasetValue[]): Observable<object> {
    const url = 'https://adb.md.utfpr.edu.br/api/interpolation/isi/geostatistics';

    this.krigingCutoff = Cutoff;
    this.krigingPairs = Pairs;

    let AutoLags = false;
    if (AmountLags === 0) {
      AutoLags = true;
    }
    this.krigingAutoLags = AutoLags;
    this.krigingAmoutLags = AmountLags;

    this.httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

    return this.httpClient.post(url, {
      autoLags: AutoLags,
      amountLags: AmountLags,
      estimator: 'classical',
      cutoff: Cutoff,
      pairs: Pairs,
      amountRangeIntervals: rangeIntervals,
      amountPartialSillIntervals: partialSill,
      models: ['gaus', 'exp', 'sph', 'matern'],
      dataset: layerDataset
    },
    {
      headers: this.httpHeaders,
      responseType: 'json',
      observe: 'response'
    });
  }
}
