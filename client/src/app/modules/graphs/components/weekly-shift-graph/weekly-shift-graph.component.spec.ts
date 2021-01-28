import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyShiftGraphComponent } from './weekly-shift-graph.component';

describe('WeeklyShiftGraphComponent', () => {
  let component: WeeklyShiftGraphComponent;
  let fixture: ComponentFixture<WeeklyShiftGraphComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WeeklyShiftGraphComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyShiftGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
