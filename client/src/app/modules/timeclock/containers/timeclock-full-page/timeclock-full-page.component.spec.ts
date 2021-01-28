import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeclockFullPageComponent } from './timeclock-full-page.component';

describe('TimeclockFullPageComponent', () => {
  let component: TimeclockFullPageComponent;
  let fixture: ComponentFixture<TimeclockFullPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TimeclockFullPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeclockFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
