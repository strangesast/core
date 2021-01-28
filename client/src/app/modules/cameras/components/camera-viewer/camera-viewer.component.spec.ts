import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CameraViewerComponent } from './camera-viewer.component';

describe('CameraViewerComponent', () => {
  let component: CameraViewerComponent;
  let fixture: ComponentFixture<CameraViewerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CameraViewerComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
