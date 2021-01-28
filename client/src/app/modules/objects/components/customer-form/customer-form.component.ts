import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill" class="name">
        <mat-label>Customer Name</mat-label>
        <input formControlName="name" matInput placeholder="Customer 123" />
      </mat-form-field>
      <ng-container formGroupName="address">
        <mat-form-field appearance="fill" class="address-line1">
          <mat-label>Address Line 1</mat-label>
          <input formControlName="line1" matInput placeholder="230 Main St" />
        </mat-form-field>
        <mat-form-field appearance="fill" class="address-line2">
          <mat-label>Address Line 2</mat-label>
          <input formControlName="line2" matInput placeholder="Apt 2" />
        </mat-form-field>
        <mat-form-field appearance="fill" class="address-city">
          <mat-label>City</mat-label>
          <input formControlName="city" matInput placeholder="East Aurora" />
        </mat-form-field>
        <mat-form-field appearance="fill" class="address-zip">
          <mat-label>Zip</mat-label>
          <input formControlName="zip" matInput placeholder="14052" />
        </mat-form-field>
        <mat-form-field appearance="fill" class="address-state">
          <mat-label>State</mat-label>
          <input formControlName="state" matInput placeholder="State" />
        </mat-form-field>
      </ng-container>
      <mat-form-field appearance="fill" class="contact">
        <mat-label>Contact</mat-label>
        <input formControlName="contact" matInput placeholder="John Doe" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="phone">
        <mat-label>Phone</mat-label>
        <input formControlName="phone" matInput placeholder="555-555-5555" />
      </mat-form-field>
    </form>
  `,
  styleUrls: ['./customer-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerFormComponent),
      multi: true,
    },
  ],
})
export class CustomerFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    address: this.fb.group({
      line1: [''],
      line2: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
    phone: [''],
    contact: [''],
  });

  sub: Subscription;

  writeValue(obj: any) {
    this.form.patchValue(obj);
  }
  onChange = (_: any) => {};

  registerOnChange(fn) {
    this.onChange = fn;
    this.sub?.unsubscribe();
    this.sub = this.form.valueChanges
      .pipe()
      .subscribe((value) => this.onChange(value));
  }

  onTouch = () => {};

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
