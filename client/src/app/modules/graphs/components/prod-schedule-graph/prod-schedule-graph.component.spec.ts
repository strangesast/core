import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProdScheduleGraphComponent } from './prod-schedule-graph.component';

describe('ProdScheduleGraphComponent', () => {
  let component: ProdScheduleGraphComponent;
  let fixture: ComponentFixture<ProdScheduleGraphComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProdScheduleGraphComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdScheduleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
