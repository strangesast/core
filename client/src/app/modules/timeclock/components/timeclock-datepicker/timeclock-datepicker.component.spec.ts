import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockDatepickerComponent } from './timeclock-datepicker.component';

describe('TimeclockDatepickerComponent', () => {
  let component: TimeclockDatepickerComponent;
  let fixture: ComponentFixture<TimeclockDatepickerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockDatepickerComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
