import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorResultsComponent } from './selector-results.component';

describe('SelectorResultsComponent', () => {
  let component: SelectorResultsComponent;
  let fixture: ComponentFixture<SelectorResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
