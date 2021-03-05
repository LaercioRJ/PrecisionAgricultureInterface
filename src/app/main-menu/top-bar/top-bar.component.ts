import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  constructor(private router: Router) {}

  title = 'precision-agriculture-interface';

  goBackFirstPage(): void {
    this.router.navigateByUrl('');
  }
}
