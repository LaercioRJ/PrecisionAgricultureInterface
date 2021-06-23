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

  fakeArray = new Array(10);

  ngAfterViewInit(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < (this.data.rgbColors.length - 1); i++) {
      const block = document.getElementById('gradientExample'.concat(String(i))) as HTMLElement;
      this.adjustExampleBlockWidth(block, (this.data.rgbColors.length - 1));
      this.adjustExampleBlockColor(block, this.data.rgbColors[i]);
    }
  }

  ngOnInit(): void {

  }

  closeDialogCancelChanges(): void {
    this.matDialogReference.close();
  }

  adjustExampleBlockWidth(block: HTMLElement, elementsQuantity: number): void{
    block.style.width = String(100 / elementsQuantity).concat('%');
  }

  adjustExampleBlockColor(block: HTMLElement, rgbCode: any): void {
    const color = 'rgb(' + String(rgbCode[0]) + ', ' + String(rgbCode[1]) + ', ' + String(rgbCode[2]) + ')';
    block.style.background = color;
  }

}
