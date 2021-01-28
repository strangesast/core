import { Input, Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-timeclock-datepicker',
  template: `
    <button mat-icon-button (click)="decrement()">
      <mat-icon>chevron_left</mat-icon>
    </button>
    <button (click)="picker.open()" mat-button>{{ value | date }}</button>
    <button mat-icon-button (click)="increment()">
      <mat-icon>chevron_right</mat-icon>
    </button>
    <mat-datepicker #picker></mat-datepicker>
    <input
      matInput
      [matDatepicker]="picker"
      [matDatepickerFilter]="filterDate"
      placeholder="Choose a date"
      [value]="value"
      (dateChange)="onChange($event.value)"
    />
  `,
  styleUrls: ['./timeclock-datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeclockDatepickerComponent),
      multi: true,
    },
  ],
})
export class TimeclockDatepickerComponent
  implements OnInit, ControlValueAccessor {
  value = new Date();

  @Input()
  max: Date;

  filterDate = (d: Date) => this.max == null || d < this.max;

  propagateChange = (_: any) => {};

  constructor() {}

  ngOnInit(): void {}

  writeValue(value: Date) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  setValue(value) {
    this.value = value;
    this.propagateChange(value);
  }

  decrement() {
    const value = new Date(this.value);
    value.setDate(value.getDate() - 1);
    this.value = value;
    this.propagateChange(this.value);
  }

  increment() {
    const value = new Date(this.value);
    value.setDate(value.getDate() + 1);
    if (this.max == null || value < this.max) {
      this.value = value;
      this.propagateChange(this.value);
    }
  }

  onChange(value) {
    this.setValue(value);
  }
}
