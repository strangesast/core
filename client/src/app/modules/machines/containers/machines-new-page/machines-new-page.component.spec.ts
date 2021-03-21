import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesNewComponent } from './machines-new.component';

describe('MachinesNewComponent', () => {
  let component: MachinesNewComponent;
  let fixture: ComponentFixture<MachinesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachinesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
