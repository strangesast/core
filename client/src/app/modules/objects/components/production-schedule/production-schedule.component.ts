import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-production-schedule',
  template: `
    <form [formGroup]="form">
      <section formArrayName="areas">
        <h2>
          <span [matBadge]="areas.controls.length" matBadgeOverlap="false"
            >Manufacturing Areas</span
          >
        </h2>
        <app-object-list-item
          *ngFor="let control of areas.controls; index as i"
          [formGroupName]="i"
          (remove)="removeFromArray(areas, i, true)"
          [minimized]="control.get('minimized').value"
          (minimizedChange)="control.patchValue({ minimized: $event })"
        >
          <span class="header">{{ control.get('value')?.value.name }}</span>
          <app-manufacturing-area-form
            class="content"
            formControlName="value"
          ></app-manufacturing-area-form>
        </app-object-list-item>
        <div>
          <button mat-stroked-button type="button" (click)="createNewArea()">
            <mat-icon>add</mat-icon> Add New Area
          </button>
        </div>
      </section>
      <section formArrayName="components">
        <h2>
          <span [matBadge]="components.controls.length" matBadgeOverlap="false"
            >Components</span
          >
        </h2>
        <app-object-list-item
          *ngFor="let control of components.controls; index as i"
          [formGroupName]="i"
          [class.minimized]="control.get('minimized').value"
          (remove)="removeFromArray(components, i, true)"
          [minimized]="control.get('minimized').value"
          (minimizedChange)="control.patchValue({ minimized: $event })"
        >
          <span class="header">
            {{ control.get('value').value.name }}
            <span
              *ngIf="control.get('value').value.subcomponents?.length as length"
              class="header-note"
              >{{ length }} Subcomponents</span
            >
            <span
              *ngIf="control.get('value').value.operations?.length as length"
              class="header-note"
              >{{ length }} Operations</span
            >
          </span>
          <app-component-form
            class="content"
            formControlName="value"
          ></app-component-form>
        </app-object-list-item>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewComponent()"
          >
            <mat-icon>add</mat-icon> Add New Component
          </button>
        </div>
      </section>
      <section formArrayName="customers">
        <h2>
          <span [matBadge]="customers.controls.length" matBadgeOverlap="false"
            >Customers</span
          >
        </h2>
        <app-object-list-item
          *ngFor="let control of customers.controls; index as i"
          (remove)="removeFromArray(customers, i, true)"
          [minimized]="control.get('minimized')?.value"
          (minimizedChange)="control.patchValue({ minimized: $event })"
          [formGroupName]="i"
        >
          <span class="header">{{ control.get('value').value.name }}</span>
          <app-customer-form
            class="content"
            formControlName="value"
          ></app-customer-form>
        </app-object-list-item>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewCustomer()"
          >
            <mat-icon>add</mat-icon> Add New Customer
          </button>
        </div>
      </section>
      <section formArrayName="manufacturingOrders">
        <h2>
          <span
            [matBadge]="manufacturingOrders.controls.length"
            matBadgeOverlap="false"
            >Manufacturing Orders</span
          >
        </h2>
        <app-object-list-item
          *ngFor="let control of manufacturingOrders.controls; index as i"
          (remove)="removeFromArray(manufacturingOrders, i, true)"
          [minimized]="control.get('minimized')?.value"
          (minimizedChange)="control.patchValue({ minimized: $event })"
          [formGroupName]="i"
        >
          <span class="header"
            >Component:
            {{ control.get('value').value.component?.name || 'None' }}</span
          >
          <div class="content">
            <app-manufacturing-order-form
              formControlName="value"
            ></app-manufacturing-order-form>
            <!--
            <mat-list *ngIf="control.get('value').value.component != null">
              <div mat-subheader>Subcomponents</div>
              <mat-list-item *ngFor="let item of [1, 2, 3]">
                <mat-icon mat-list-icon>{{ item < 3 ? 'done' : item == 3 ? 'cached' : 'clear' }}</mat-icon>
                <div mat-line>Component {{item}}</div>
                <div mat-line>Available since 4/20/2020</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <div mat-subheader>Operations</div>
              <mat-list-item *ngFor="let item of [1, 2, 3, 4, 5]">
                <mat-icon mat-list-icon>{{ item < 3 ? 'done' : item == 3 ? 'cached' : 'clear' }}</mat-icon>
                <div mat-line>Operation {{item}}</div>
                <div mat-line>Completed by Sam on 4/20/2020</div>
              </mat-list-item>
            </mat-list>
            -->
          </div>
        </app-object-list-item>
        <div>
          <button
            mat-stroked-button
            type="button"
            (click)="createNewManufacturingOrder()"
          >
            <mat-icon>add</mat-icon> Add New Manufacturing Order
          </button>
        </div>
      </section>
    </form>
  `,
  styleUrls: ['./production-schedule.component.scss'],
  animations: [
    trigger('expand', [
      state('void', style({ height: '0px', minHeight: '0' })),
      state('*', style({ height: '*' })),
      transition('* => *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductionScheduleComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  lastID = 0;

  form = this.fb.group({
    areas: this.fb.array([
      this.fb.group({
        value: [{ name: 'Stage 1', id: 'stage-1' }, Validators.required],
        minimized: [true],
      }),
    ]),
    components: this.fb.array([
      this.fb.group({
        value: [
          {
            id: 'product_a',
            name: 'Product A',
            description: '',
            subcomponents: [],
            operations: [
              {
                id: ['operation-1', Validators.required],
                name: ['Operation 1'],
                area: ['stage-1'],
                prerequisites: [],
              },
              {
                id: ['operation-2', Validators.required],
                name: ['Operation 2'],
                area: ['stage-1'],
                prerequisites: ['operation-1'],
              },
            ],
          },
          Validators.required,
        ],
        minimized: [true],
      }),
    ]),
    customers: this.fb.array([
      this.fb.group({
        value: {
          id: 'customer_123',
          name: 'Customer 123',
          address: {
            line1: '',
            line2: '',
            city: 'East Aurora',
            state: 'NY',
            zip: '14052',
          },
          phone: '716-555-5555',
          contact: 'John Doe',
        },
        minimized: true,
      }),
    ]),
    manufacturingOrders: this.fb.array([
      this.fb.group({
        value: [
          {
            component: null,
          },
        ],
        minimized: false,
      }),
    ]),
  });

  get areas() {
    return this.form.get('areas') as FormArray;
  }

  get components() {
    return this.form.get('components') as FormArray;
  }

  get customers() {
    return this.form.get('customers') as FormArray;
  }

  get manufacturingOrders() {
    return this.form.get('manufacturingOrders') as FormArray;
  }

  createNewArea() {
    this.areas.push(
      this.fb.group({
        value: [
          {
            id: 'new-area',
            name: 'New Area',
          },
        ],
        minimized: [false],
      })
    );
  }

  createNewComponent() {
    this.components.push(
      this.fb.group({
        value: {
          id: 'new-product',
          name: 'New Product',
          description: '',
          subcomponents: [],
          operations: [],
        },
        minimized: false,
      })
    );
  }

  createNewCustomer() {
    this.customers.push(
      this.fb.group({
        value: {
          id: 'new-customer',
          name: 'New Customer',
          address: {},
        },
        minimized: false,
      })
    );
  }

  createNewManufacturingOrder() {
    this.manufacturingOrders.push(
      this.fb.group({
        value: [
          {
            id: 'manufacturing-order-0',
            component: null,
          },
          Validators.required,
        ],
        minimized: [false],
      })
    );
  }

  removeFromArray(array: FormArray, index: number, confirm = false) {
    if (!confirm || window.confirm('Are you sure?')) {
      array.removeAt(index);
    }
  }

  constructor(public fb: FormBuilder, public service: ObjectsService) {}

  ngOnInit() {
    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this.destroyed$))
      .subscribe((value) => {
        let obj = this.service.data$.getValue();
        for (const [key, arr] of Object.entries(value)) {
          obj = { ...obj, [key]: arr };
        }
        this.service.data$.next(obj);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
