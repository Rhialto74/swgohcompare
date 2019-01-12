import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonStatTableComponent } from './comparison-stat-table.component';

describe('ComparisonStatTableComponent', () => {
  let component: ComparisonStatTableComponent;
  let fixture: ComponentFixture<ComparisonStatTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonStatTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonStatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
