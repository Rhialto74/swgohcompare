import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonModsMobileComponent } from './comparison-mods-mobile.component';

describe('ComparisonModsMobileComponent', () => {
  let component: ComparisonModsMobileComponent;
  let fixture: ComponentFixture<ComparisonModsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonModsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonModsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
