import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionScheduleComponent } from './production-schedule.component';

describe('ProductionScheduleComponent', () => {
  let component: ProductionScheduleComponent;
  let fixture: ComponentFixture<ProductionScheduleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProductionScheduleComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
