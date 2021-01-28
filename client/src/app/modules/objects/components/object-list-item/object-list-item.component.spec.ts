import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObjectListItemComponent } from './object-list-item.component';

describe('ObjectListItemComponent', () => {
  let component: ObjectListItemComponent;
  let fixture: ComponentFixture<ObjectListItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ObjectListItemComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
