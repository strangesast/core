import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObjectsMainPageComponent } from './objects-main-page.component';

describe('ObjectsMainPageComponent', () => {
  let component: ObjectsMainPageComponent;
  let fixture: ComponentFixture<ObjectsMainPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ObjectsMainPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
