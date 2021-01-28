import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginBasePageComponent } from './login-base-page.component';

describe('LoginBasePageComponent', () => {
  let component: LoginBasePageComponent;
  let fixture: ComponentFixture<LoginBasePageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginBasePageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
