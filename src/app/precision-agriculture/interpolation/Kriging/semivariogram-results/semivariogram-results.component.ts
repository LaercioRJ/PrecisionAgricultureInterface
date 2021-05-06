import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-semivariogram-results',
  templateUrl: './semivariogram-results.component.html',
  styleUrls: ['./semivariogram-results.component.css']
})
export class SemivariogramResultsComponent implements OnInit {

  image: any;

  constructor(private semivariogramDialogRef: MatDialogRef<SemivariogramResultsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.readBlobAsImage(this.data.semivariogramImage);
  }

  readBlobAsImage(blobImage: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image = reader.result;
    }, false);

    if (blobImage) {
      reader.readAsDataURL(blobImage);
    }
  }

  closeScreen(): void {
    this.semivariogramDialogRef.close();
  }

  downloadJpg(): void {
    const blobImage: Blob = this.data.semivariogramImage;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobImage);
    link.setAttribute('visibility', 'hidden');
    link.download = 'Semivariogram';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
