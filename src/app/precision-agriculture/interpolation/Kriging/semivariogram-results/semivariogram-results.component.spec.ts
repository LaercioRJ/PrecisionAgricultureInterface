import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemivariogramResultsComponent } from './semivariogram-results.component';

describe('SemivariogramResultsComponent', () => {
  let component: SemivariogramResultsComponent;
  let fixture: ComponentFixture<SemivariogramResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemivariogramResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemivariogramResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
