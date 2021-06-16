import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Layer } from '../../../../classes/layer';
import { SamplingLayer } from '../../../../classes/samplingLayer';

import { ControlValidationService } from '../../../../services/validation/control-validation.service';
import { MessageDeliveryService } from '../../../../services/message-delivery.service';
import { ServerConnectionService } from '../../../server-connection.service';

import { IdwSelectorComponent } from '../idw-selector/idw-selector.component';

@Component({
  selector: 'app-idw',
  templateUrl: './idw.component.html',
  styleUrls: ['./idw.component.css']
})
export class IDWComponent implements OnInit {
  @Input() selectedLayer!: Layer;

  idwForm = new FormGroup({
    exponent: new FormControl({disabled: false, value: 0.5}, [Validators.min(0.5), Validators.max(10),
      ControlValidationService.integerValidation()]),
    pixelX: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10),
      ControlValidationService.integerValidation()]),
    pixelY: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10),
      ControlValidationService.integerValidation()]),
    radius: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(100),
      ControlValidationService.integerValidation()]),
    neighbors: new FormControl({disabled: true, value: 1}, [Validators.min(1), Validators.max(50),
      ControlValidationService.integerValidation()]),
    selectedArea: new FormControl({disabled: false, value: 'radius'})
  });
  loadBarState = 'none';

  constructor(private matDialog: MatDialog,
              private messageDelivery: MessageDeliveryService,
              private serverConnection: ServerConnectionService) { }

  ngOnInit(): void {
  }

  openSelectorDialog(): void {
    const selectorDialogRef = this.matDialog.open(IdwSelectorComponent, {
      width: '900px',
      disableClose: true,
      data: { layer: this.selectedLayer }
    });

    // tslint:disable-next-line: deprecation
    selectorDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.idwForm.get('exponent')?.setValue(result.data);
        this.messageDelivery.showMessage('Expoente escolhido com sucesso.', 2400);
      }
    });
  }

  executeIdwInterpolation(): void {
    const exponent = this.idwForm.get('exponent')?.value;
    const neighbors = this.idwForm.get('neighbors')?.value;
    const radius = this.idwForm.get('radius')?.value;
    const pixelX = this.idwForm.get('pixelX')?.value;
    const pixelY = this.idwForm.get('pixelY')?.value;
    const contourn = (this.selectedLayer as SamplingLayer).contourn.coordinates;
    this.loadBarState = 'block';
    this.serverConnection.consumeIdwInterpolation(exponent, neighbors, radius, pixelX, pixelY, this.selectedLayer.dataset,
      (this.selectedLayer as SamplingLayer).contourn.coordinates).toPromise().then( result => {
        this.loadBarState = 'none';
        const serverResult  = JSON.parse(JSON.stringify(result)).body;
        const newLayer = new SamplingLayer(this.selectedLayer.name, this.selectedLayer.latitudeHeader, this.selectedLayer.longitudeHeader,
          this.selectedLayer.dataHeader, this.selectedLayer.datasetLength);
        newLayer.idwExpoent = exponent;
        newLayer.neighbors = neighbors;
        newLayer.radius = radius;
        newLayer.pixelX = pixelX;
        newLayer.pixelY = pixelY;
      },
        error => {
          this.loadBarState = 'none';
          this.messageDelivery.showMessage('Houve um problema ao consultar o servidor, por favor tente mais tarde.', 2400);
        }
      );
  }

  disableRadioButton(changedInput: string): void {
    if (this.idwForm.get('selectedArea')?.value !== changedInput) {
      if (this.idwForm.get('radius')?.disabled) {
        this.idwForm.get('radius')?.enable();
        this.idwForm.get('neighbors')?.disable();
      } else {
        this.idwForm.get('radius')?.disable();
        this.idwForm.get('neighbors')?.enable();
      }
    }
  }

}
