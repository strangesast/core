import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachineLiveGraphComponent } from './machine-live-graph.component';

describe('MachineLiveGraphComponent', () => {
  let component: MachineLiveGraphComponent;
  let fixture: ComponentFixture<MachineLiveGraphComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MachineLiveGraphComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLiveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
