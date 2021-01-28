import { forwardRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manufacturing-area-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input formControlName="name" matInput placeholder="Area Name" />
        <mat-hint>A catchy name</mat-hint>
      </mat-form-field>
    </form>
  `,
  styleUrls: ['./manufacturing-area-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManufacturingAreaFormComponent),
      multi: true,
    },
  ],
})
export class ManufacturingAreaFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  form = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
  });

  get name() {
    return this.form.get('name') as FormControl;
  }

  sub: Subscription;

  destroyed$ = new Subject();

  writeValue(obj: any) {
    this.form.patchValue(obj);
  }
  onChange = (_: any) => {};

  registerOnChange(fn) {
    this.onChange = fn;
    this.sub?.unsubscribe();
    this.sub = this.form.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => this.onChange(value));
  }

  onTouch = () => {};

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.name.valueChanges.subscribe((name) =>
      this.form.patchValue({ id: name.split(' ').join('-') })
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
