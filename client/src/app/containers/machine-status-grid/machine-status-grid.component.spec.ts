import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachineStatusGridComponent } from './machine-status-grid.component';

describe('MachineStatusGridComponent', () => {
  let component: MachineStatusGridComponent;
  let fixture: ComponentFixture<MachineStatusGridComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MachineStatusGridComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineStatusGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
