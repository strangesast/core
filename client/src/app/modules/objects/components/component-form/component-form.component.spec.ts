import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentFormComponent } from './component-form.component';

describe('ComponentFormComponent', () => {
  let component: ComponentFormComponent;
  let fixture: ComponentFixture<ComponentFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ComponentFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
