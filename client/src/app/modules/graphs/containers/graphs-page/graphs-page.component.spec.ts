import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraphsPageComponent } from './graphs-page.component';

describe('GraphsPageComponent', () => {
  let component: GraphsPageComponent;
  let fixture: ComponentFixture<GraphsPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GraphsPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
