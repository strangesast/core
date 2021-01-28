import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimesheetPageComponent } from './timesheet-page.component';

describe('TimesheetPageComponent', () => {
  let component: TimesheetPageComponent;
  let fixture: ComponentFixture<TimesheetPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimesheetPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
