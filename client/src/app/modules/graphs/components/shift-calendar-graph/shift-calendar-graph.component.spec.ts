import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShiftCalendarGraphComponent } from './shift-calendar-graph.component';

describe('ShiftCalendarGraphComponent', () => {
  let component: ShiftCalendarGraphComponent;
  let fixture: ComponentFixture<ShiftCalendarGraphComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ShiftCalendarGraphComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCalendarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
