import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonDropDownComponent } from './comparison-drop-down.component';

describe('ComparisonDropDownComponent', () => {
  let component: ComparisonDropDownComponent;
  let fixture: ComponentFixture<ComparisonDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
