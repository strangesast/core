import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProdScheduleGraphDialogComponent } from './prod-schedule-graph-dialog.component';

describe('ProdScheduleGraphDialogComponent', () => {
  let component: ProdScheduleGraphDialogComponent;
  let fixture: ComponentFixture<ProdScheduleGraphDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProdScheduleGraphDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdScheduleGraphDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
