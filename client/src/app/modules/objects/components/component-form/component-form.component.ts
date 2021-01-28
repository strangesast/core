import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ControlValueAccessor,
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription, ReplaySubject } from 'rxjs';
import {
  map,
  takeUntil,
  withLatestFrom,
  startWith,
  refCount,
  multicast,
} from 'rxjs/operators';

import { IComponent, CVASig } from '../../models';
import { ObjectsService } from '../../services/objects.service';

type Sig = CVASig<IComponent>;

@Component({
  selector: 'app-component-form',
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input formControlName="name" matInput placeholder="Product Name" />
        <mat-hint>A catchy name</mat-hint>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <textarea formControlName="description" matInput></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Subcomponents</mat-label>
        <mat-select formControlName="subcomponents" multiple>
          <mat-select-trigger>
            {{ subcomponents.value ? subcomponents.value.length : 0 }}
            Components
          </mat-select-trigger>
          <mat-option
            *ngFor="let component of subcomponents$ | async"
            [value]="component.id"
            >{{ component.name }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <div class="sub-header">
        <span>Operations</span>
        <span class="spacer"></span>
        <div>
          <button
            *ngIf="editOperations"
            mat-stroked-button
            (click)="addOperation()"
          >
            <mat-icon>add</mat-icon> Add Operation
          </button>
        </div>
        <div>
          <button mat-flat-button (click)="editOperations = !editOperations">
            Toggle Operations Edit
          </button>
        </div>
      </div>
      <div
        formArrayName="operations"
        class="form-list"
        *ngIf="editOperations; else templ"
      >
        <div
          *ngFor="let control of operations.controls; index as j"
          [formGroupName]="j"
          class="form-list-item"
        >
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input
              formControlName="name"
              matInput
              placeholder="Operation Name"
            />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Area</mat-label>
            <mat-select formControlName="area">
              <mat-option
                *ngFor="let area of areas$ | async"
                [value]="area.id"
                >{{ area.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Prerequisites</mat-label>
            <mat-select formControlName="prerequisites" multiple>
              <mat-option
                *ngFor="
                  let prerequisite of validPrerequisites(control.value?.id)
                    | async
                "
                [value]="prerequisite.id"
                >{{ prerequisite.name }}</mat-option
              >
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="removeFromArray(operations, j)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
      <ng-template #templ>
        <div
          cdkDropList
          class="example-list"
          (cdkDropListDropped)="drop(operations, $event)"
        >
          <div
            cdkDrag
            class="example-box"
            *ngFor="let control of operations.controls"
          >
            <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
            <span>{{ control.get('name').value }}</span>
            <!--<span class="area">{{ lookupArea(control.get('area').value)?.name }}</span>-->
          </div>
        </div>
      </ng-template>
    </form>
  `,
  styleUrls: ['./component-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComponentFormComponent),
      multi: true,
    },
  ],
})
export class ComponentFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  // lookup subcomponents
  destroyed$ = new Subject();
  sub: Subscription;
  onChange: Sig;

  editOperations = true;

  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: [''],
    subcomponents: [[]],
    operations: this.fb.array([]),
  });

  areas$ = this.service.areas$;

  subcomponents$ = this.service.components$.pipe(
    withLatestFrom(this.form.valueChanges.pipe(startWith(this.form.value))),
    map(([arr, value]) => arr.filter((v) => v.id !== value.id))
  );

  get id() {
    return this.form.get('id') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  name$ = this.name.valueChanges;

  get subcomponents() {
    return this.form.get('subcomponents') as FormControl;
  }

  get operations() {
    return this.form.get('operations') as FormArray;
  }

  operations$ = this.operations.valueChanges.pipe(
    startWith(this.operations.value),
    multicast(new ReplaySubject(1)),
    refCount()
  );

  writeValue(obj: any) {
    console.log('obj', obj);
    const { operations, ...rest } = obj;
    this.form.patchValue(rest);
    this.form
      .get('operations')
      .setValue(
        obj.operations.map((value) =>
          this.fb.group({ value: this.fb.group(value), editing: [false] })
        )
      );
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

  ngOnInit() {
    this.name$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((name) =>
        this.form.patchValue({ id: name.split(' ').join('-') })
      );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addOperation() {
    let lastOperationNum = 0;
    if (this.operations.controls.length > 0) {
      const { name } = this.operations.controls[
        this.operations.controls.length - 1
      ].value;
      lastOperationNum = +name.split(' ').slice(-1)[0] || 0;
    }
    const operationName = `Operation ${lastOperationNum + 1}`;
    this.operations.push(
      this.fb.group({
        id: [operationName.split(' ').join('-').toLowerCase()],
        name: [operationName],
        area: [null],
        prerequisites: [[]],
      })
    );
  }

  removeFromArray(array: FormArray, index: number, confirm = false) {
    if (!confirm || window.confirm('Are you sure?')) {
      array.removeAt(index);
    }
  }

  drop(control: FormArray, event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(control.controls, event.previousIndex, event.currentIndex);
  }

  validPrerequisites(id: string) {
    return this.operations$.pipe(map((arr) => arr.filter((v) => v.id !== id)));
  }
}
