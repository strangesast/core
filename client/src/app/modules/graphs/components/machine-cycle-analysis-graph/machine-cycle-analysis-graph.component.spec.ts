import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachineCycleAnalysisGraphComponent } from './machine-cycle-analysis-graph.component';

describe('MachineCycleAnalysisGraphComponent', () => {
  let component: MachineCycleAnalysisGraphComponent;
  let fixture: ComponentFixture<MachineCycleAnalysisGraphComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MachineCycleAnalysisGraphComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCycleAnalysisGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
