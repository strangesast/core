import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockPageComponent } from './timeclock-page.component';

describe('TimeclockPageComponent', () => {
  let component: TimeclockPageComponent;
  let fixture: ComponentFixture<TimeclockPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
