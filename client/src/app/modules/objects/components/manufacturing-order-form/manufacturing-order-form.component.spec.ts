import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManufacturingOrderFormComponent } from './manufacturing-order-form.component';

describe('ManufacturingOrderFormComponent', () => {
  let component: ManufacturingOrderFormComponent;
  let fixture: ComponentFixture<ManufacturingOrderFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManufacturingOrderFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
