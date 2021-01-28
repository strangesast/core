import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoopComponent } from './noop.component';

describe('NoopComponent', () => {
  let component: NoopComponent;
  let fixture: ComponentFixture<NoopComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoopComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
