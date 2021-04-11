import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Layer } from '../../../../classes/layer';

@Component({
  selector: 'app-idw',
  templateUrl: './idw.component.html',
  styleUrls: ['./idw.component.css']
})
export class IDWComponent implements OnInit {
  @Input() selectedLayer!: Layer;

  idwForm = new FormGroup({
    exponent: new FormControl({disabled: false, value: 0.5}, [Validators.min(0.5), Validators.max(10)]),
    pixelX: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)]),
    pixelY: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(10)]),
    radius: new FormControl({disabled: false, value: 1}, [Validators.min(1), Validators.max(100)]),
    neighbors: new FormControl({disabled: true, value: 1}, [Validators.min(1), Validators.max(50)]),
    selectedArea: new FormControl({disabled: false, value: 'radius'})
  });
  loadBarState = 'none';

  constructor() { }

  ngOnInit(): void {
  }

  consumeIdwInterpolation(): void {
    const exponent = this.idwForm.get('exponent')?.value;
    const neighbors = this.idwForm.get('neighbors')?.value;
    const radius = this.idwForm.get('radius')?.value;
    const pixelX = this.idwForm.get('pixelX')?.value;
    const pixelY = this.idwForm.get('pixelY')?.value;
    this.loadBarState = 'block';
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
