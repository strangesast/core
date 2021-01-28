import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderListPageComponent } from './order-list-page.component';

describe('OrderListPageComponent', () => {
  let component: OrderListPageComponent;
  let fixture: ComponentFixture<OrderListPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrderListPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
