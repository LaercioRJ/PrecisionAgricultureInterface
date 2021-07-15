import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gradient-customization',
  templateUrl: './gradient-customization.component.html',
  styleUrls: ['./gradient-customization.component.css']
})
export class GradientCustomizationComponent implements AfterViewInit, OnInit {

  constructor(private matDialogReference: MatDialogRef<GradientCustomizationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
    const colorsQuantity = this.data.rgbColors.length;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < (colorsQuantity - 2); i++) {
      const block = document.getElementById('gradientExample'.concat(String(i))) as HTMLElement;
      this.adjustExampleBlockWidth(block, (colorsQuantity - 2));
    }
    const red = this.data.rgbColors[colorsQuantity - 1][0];
    const green = this.data.rgbColors[colorsQuantity - 1][1];
    const blue = this.data.rgbColors[colorsQuantity - 1][2];
    this.applyGradient(red, green, blue);
  }

  ngOnInit(): void {

  }

  adjustExampleBlockWidth(block: HTMLElement, elementsQuantity: number): void{
    block.style.width = String(100 / elementsQuantity).concat('%');
  }

  applyGradient(activeRed: number, activeGreen: number, activeBlue: number): void {
    const rgbGradientInterval = 255 / (this.data.rgbColors.length - 2);
    const rgbSet: number[][] = [];
    for (let i = 0; i < (this.data.rgbColors.length - 2); i++) {
      const block = document.getElementById('gradientExample'.concat(String(i))) as HTMLElement;
      const rgbCode: number[] = [];
      rgbCode.push(((Math.round(rgbGradientInterval) * (i + 1)) - 1) * activeRed);
      rgbCode.push(((Math.round(rgbGradientInterval) * (i + 1)) - 1) * activeGreen);
      rgbCode.push(((Math.round(rgbGradientInterval) * (i + 1)) - 1) * activeBlue);
      this.adjustExampleBlockColor(block, rgbCode);
      rgbSet.push(rgbCode);
    }
    rgbSet.push(this.data.rgbColors[this.data.rgbColors.length - 2]);
    this.data.rgbColors[this.data.rgbColors.length - 1] = [activeRed, activeGreen, activeBlue];
    rgbSet.push(this.data.rgbColors[this.data.rgbColors.length - 1]);
    this.data.rgbColors = rgbSet;
  }

  closeDialogApplyChanges(): void {
    const colors = this.data.rgbColors;
    this.matDialogReference.close({
      colors
    });
  }

  closeDialogCancelChanges(): void {
    this.matDialogReference.close();
  }

  adjustExampleBlockColor(block: HTMLElement, rgbCode: any): void {
    const color = 'rgb(' + String(rgbCode[0]) + ', ' + String(rgbCode[1]) + ', ' + String(rgbCode[2]) + ')';
    block.style.background = color;
  }

}
