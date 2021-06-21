import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-individual-color-customization',
  templateUrl: './individual-color-customization.component.html',
  styleUrls: ['./individual-color-customization.component.css']
})
export class IndividualColorCustomizationComponent implements OnInit {

  constructor(private matDialogReference: MatDialogRef<IndividualColorCustomizationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  blueRgbValue = '';
  blueSliderValue = 0;
  greenRgbValue = '';
  greenSliderValue = 0;
  newColorValues = [this.data.rgbColorToAlter[0], this.data.rgbColorToAlter[1], this.data.rgbColorToAlter[2]];
  redRgbValue = '';
  redSliderValue = 0;
  structureToAlter = this.data.alteredStructureName;

  ngOnInit(): void {
    this.alterSelectedColor();
  }

  closeDialogApplyChanges(): void {
    this.matDialogReference.close({
      data: this.newColorValues
    });
  }

  closeDialogCancelChanges(): void {
    this.matDialogReference.close();
  }

  alterClassColor(redLevel: number, greenLevel: number, blueLevel: number): void {
    this.newColorValues[0] = redLevel;
    this.newColorValues[1] = greenLevel;
    this.newColorValues[2] = blueLevel;
    this.alterSelectedColor();
  }

  alterSelectedColor(): void {
    const red = this.newColorValues[0];
    const green = this.newColorValues[1];
    const blue = this.newColorValues[2];
    this.redSliderValue = red;
    this.greenSliderValue = green;
    this.blueSliderValue = blue;
    this.redRgbValue = red.toString();
    this.greenRgbValue = green.toString();
    this.blueRgbValue = blue.toString();
    // tslint:disable-next-line: no-non-null-assertion
    document.getElementById('rectangleColorExample')!.style.background = 'rgb(' + this.redRgbValue + ', ' + this.greenRgbValue + ', '
      + this.blueRgbValue + ')';
  }

}
