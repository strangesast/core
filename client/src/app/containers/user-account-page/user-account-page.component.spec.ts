import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserAccountPageComponent } from './user-account-page.component';

describe('UserAccountPageComponent', () => {
  let component: UserAccountPageComponent;
  let fixture: ComponentFixture<UserAccountPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserAccountPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
