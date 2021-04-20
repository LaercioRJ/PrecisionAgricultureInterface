import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { Layer } from '../../../../classes/layer';

import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { ServerConnectionService } from '../../../server-connection.service';

@Component({
  selector: 'app-kriging',
  templateUrl: './kriging.component.html',
  styleUrls: ['./kriging.component.css']
})
export class KrigingComponent implements OnInit {
  @Input() selectedLayer!: Layer;

  krigingSelectorForm = new FormGroup({
    rangeIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100)]),
    partialSillIntervals: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(100)]),
    cutoff: new FormControl({disabled: false, value: 10}, [Validators.min(10), Validators.max(100)]),
    pairs: new FormControl({disabled: false, value: 2}, [Validators.min(2), Validators.max(50)]),
    amountLags: new FormControl({disabled: true, value: 5}, [Validators.min(5), Validators.max(15)]),
    selectedLagType: new FormControl({disabled: false, value: 'automatic'})
  });
  loadBarStateParameters = 'none';

  krigingForm = new FormGroup({
    sizePixelX: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)]),
    sizePixelY: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)])
  });
  loadBarStateKriging = 'none';

  semivariogramForm = new FormGroup({
    xAxis: new FormControl({disabled: false, value: 'eixo x'}, [Validators.required]),
    yAxis: new FormControl({disabled: false, value: 'eixo y'}, [Validators.required]),
    semivariogramWidth: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000)]),
    semivariogramHeight: new FormControl({disabled: false, value: 750}, [Validators.min(500), Validators.max(1000)])
  });
  loadBarStateSemivariogram = 'none';

  constructor(private messageDelivery: MessageDeliveryService,
              private serverConnection: ServerConnectionService) { }

  ngOnInit(): void {
  }

  disableRadioInput(selectedInput: string): void {
    if (selectedInput !== this.krigingSelectorForm.get('selectedLagType')?.value) {
      if (this.krigingSelectorForm.get('amountLags')?.disabled === true) {
        this.krigingSelectorForm.get('amountLags')?.enable();
      } else {
        this.krigingSelectorForm.get('amountLags')?.disable();
      }
    }
  }

  executeInterpolatorSelector(stepper: MatStepper): void {

  }
}
