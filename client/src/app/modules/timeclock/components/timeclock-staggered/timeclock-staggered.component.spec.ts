import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockStaggeredComponent } from './timeclock-staggered.component';

describe('TimeclockStaggeredComponent', () => {
  let component: TimeclockStaggeredComponent;
  let fixture: ComponentFixture<TimeclockStaggeredComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockStaggeredComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockStaggeredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
