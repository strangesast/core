import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockShiftDialogComponent } from './timeclock-shift-dialog.component';

describe('TimeclockShiftDialogComponent', () => {
  let component: TimeclockShiftDialogComponent;
  let fixture: ComponentFixture<TimeclockShiftDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockShiftDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
