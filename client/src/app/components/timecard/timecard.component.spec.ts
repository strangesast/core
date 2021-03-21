import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimecardComponent } from './timecard.component';

describe('TimecardComponent', () => {
  let component: TimecardComponent;
  let fixture: ComponentFixture<TimecardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimecardComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});