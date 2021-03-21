import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-machines-new-page',
  template: `
    <form [formGroup]="form">
      <h1>Add a Machine</h1>
      <p>
        <mat-form-field appearance="standard">
          <mat-label>IP Address</mat-label>
          <input matInput placeholder="0.0.0.0" />
          <mat-hint>IP Address of machine</mat-hint>
        </mat-form-field>
      </p>
      <button mat-stroked-button>Cancel</button>
      <button mat-stroked-button color="primary">Create</button>
    </form>
  `,
  styleUrls: ['./machines-new-page.component.scss'],
})
export class MachinesNewPageComponent implements OnInit {
  form = this.fb.group({
    'ip-address': ['', Validators.required],
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}
}
