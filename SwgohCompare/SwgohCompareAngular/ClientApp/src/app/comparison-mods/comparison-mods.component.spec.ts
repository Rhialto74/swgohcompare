import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonModsComponent } from './comparison-mods.component';

describe('ComparisonModsComponent', () => {
  let component: ComparisonModsComponent;
  let fixture: ComponentFixture<ComparisonModsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonModsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
