import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
  FormArray,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import {
  takeUntil,
  map,
  startWith,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { ObjectsService } from '../../services/objects.service';
import { IManufacturingOrder, CVASig } from '../../models';

type Sig = CVASig<IManufacturingOrder>;

@Component({
  selector: 'app-manufacturing-order-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill" class="col-span-2 component">
        <mat-label>Component</mat-label>
        <mat-select formControlName="component">
          <mat-option
            *ngFor="let component of components$ | async"
            [value]="component.id"
            >{{ component.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill" class="col-span-2 customer">
        <mat-label>Customer</mat-label>
        <mat-select formControlName="customer">
          <mat-option
            *ngFor="let customer of customers$ | async"
            [value]="customer.id"
            >{{ customer.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Qty</mat-label>
        <input
          type="number"
          min="0"
          formControlName="qty"
          matInput
          placeholder="1000"
        />
        <mat-hint>Top level qty</mat-hint>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Ship Date</mat-label>
        <input matInput formControlName="shipDate" [matDatepicker]="picker" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-selection-list
        *ngIf="component$ | async as component"
        class="col-span-2"
      >
        <mat-list-option *ngFor="let item of component.operations">{{
          item.name
        }}</mat-list-option>
        <mat-divider></mat-divider>
        <mat-list-option *ngFor="let item of component.subcomponents">{{
          item.name
        }}</mat-list-option>
      </mat-selection-list>
    </form>
  `,
  styleUrls: ['./manufacturing-order-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManufacturingOrderFormComponent),
      multi: true,
    },
  ],
})
export class ManufacturingOrderFormComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  form = this.fb.group({
    component: [null, Validators.required],
    customer: [null, Validators.required],
    qty: [0, Validators.min(1)],
    shipDate: [null, Validators.required],
    parent: [null],
    // need to identify stock (available component) or mfg. order child
    components: this.fb.array([
      this.fb.group({
        type: ['stock', Validators.required],
      }),
    ]),
    operations: this.fb.array([
      this.fb.group({
        id: ['step_1'],
        state: ['incomplete'],
        started_at: [new Date()],
        available_at: [new Date()],
        completed_at: [null],
        segments: this.fb.array([
          this.fb.group({
            employee_id: [''],
            date_start: [new Date()],
            date_stop: [new Date()],
            amount: [10],
          }),
        ]),
      }),
    ]),
  });
  onChange: Sig;

  get operations() {
    return this.form.get('operations') as FormArray;
  }

  get components() {
    return this.form.get('components') as FormArray;
  }

  components$ = this.service.components$;

  component$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    pluck('component'),
    switchMap((id) =>
      this.components$.pipe(
        map((components) => components.find((c) => c.id === id))
      )
    )
  );

  sub: Subscription;
  destroyed$ = new Subject();
  customers$ = this.service.customers$;

  writeValue(obj: IManufacturingOrder) {
    this.form.patchValue(obj);
  }

  registerOnChange(fn: Sig) {
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

  constructor(public fb: FormBuilder, public service: ObjectsService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
