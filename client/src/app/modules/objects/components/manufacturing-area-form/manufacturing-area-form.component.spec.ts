import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManufacturingAreaFormComponent } from './manufacturing-area-form.component';

describe('ManufacturingAreaFormComponent', () => {
  let component: ManufacturingAreaFormComponent;
  let fixture: ComponentFixture<ManufacturingAreaFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManufacturingAreaFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingAreaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
