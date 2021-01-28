import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartPageComponent } from './part-page.component';

describe('PartPageComponent', () => {
  let component: PartPageComponent;
  let fixture: ComponentFixture<PartPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PartPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
