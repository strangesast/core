import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ReplaySubject } from 'rxjs';
import {
  switchMap,
  tap,
  takeUntil,
  startWith,
  map,
  filter,
  pluck,
  multicast,
  refCount,
} from 'rxjs/operators';
import * as d3 from 'd3';
import { group } from 'd3-array';

import { BaseGraphComponent } from '../base-graph/base-graph.component';

const query = gql`
  query MyQuery($employeeId: Int!) {
    timeclock_shifts_daily(
      where: { employee_id: { _eq: $employeeId } }
      order_by: { date_start: asc }
    ) {
      date
      date_start
      date_stop
      duration
      employee_id
      shifts
    }
    employee: employees_by_pk(id: $employeeId) {
      color
      first_name
      hire_date
      id
      last_name
      middle_name
      user_id
    }
  }
`;

const employeesQuery = gql`
  query {
    employees(order_by: { last_name: asc }) {
      first_name
      id
      last_name
      middle_name
      color
    }
  }
`;

@Component({
  selector: 'app-shift-calendar-graph',
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Employee</mat-label>
        <mat-select formControlName="employeeId">
          <mat-option
            *ngFor="let employee of employees$ | async"
            [value]="employee.id"
          >
            {{ employee.first_name }} {{ employee.last_name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <a
        *ngIf="form.get('employeeId').value as employeeId"
        [routerLink]="['/people', employeeId]"
        >Employee Page</a
      >
    </form>
    <svg #svg></svg>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      svg {
        flex: auto 1 1;
        display: block;
      }
      form {
        padding: 20px;
      }
    `,
  ],
})
export class ShiftCalendarGraphComponent extends BaseGraphComponent
  implements OnInit, AfterViewInit {
  form = this.fb.group({
    employeeId: [''],
  });

  employees$ = this.apollo.query({ query: employeesQuery }).pipe(
    pluck('data', 'employees'),
    tap((employees: any) => {
      if (employees.length > 0) {
        const employeeId = employees[0].id;
        this.form.patchValue({ employeeId });
      }
    })
  );

  employeeId$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    pluck('employeeId'),
    filter((employeeId) => employeeId !== ''),
    map((employeeId) => parseInt(employeeId, 10)),
    multicast(new ReplaySubject(1)),
    refCount()
  );

  data$ = this.employeeId$.pipe(
    switchMap((employeeId) =>
      this.apollo.query({ query, variables: { employeeId } })
    ),
    takeUntil(this.destroyed$),
    pluck('data'),
    map(({ employee, timeclock_shifts_daily }) => {
      const { hire_date } = employee;
      const [yyyy, mm, dd] = hire_date.split('-').map((s) => parseInt(s, 10));
      const hireDate = new Date(yyyy, mm - 1, dd);
      return {
        employee: { ...employee, hire_date: hireDate },
        shifts: timeclock_shifts_daily.map(
          ({ employee_id, date, date_start, date_stop, duration, shifts }) => ({
            employee_id,
            date: new Date(
              ...(date
                .split('-')
                .map((s) => parseInt(s, 10))
                .map((f, i) => (i === 1 ? f - 1 : f)) as [
                number,
                number,
                number
              ])
            ),
            date_start:
              date_start &&
              new Date(
                (date_start.endsWith('+00:00')
                  ? date_start.slice(0, -6)
                  : date_start) + 'Z'
              ),
            date_stop:
              date_stop &&
              new Date(
                (date_stop.endsWith('+00:00')
                  ? date_stop.slice(0, -6)
                  : date_stop) + 'Z'
              ),
            duration,
            shifts,
          })
        ),
      };
    })
  );

  constructor(
    public apollo: Apollo,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const p = 40;
    const hi = 20;
    const h = hi * 8;

    const g = this.svg.append('g');
    this.data$.subscribe(({ employee, shifts }) => {
      const color = d3.interpolateRgb('white', d3.color(employee.color));
      const extent = d3.extent(shifts, (d: any) => d.date_start);
      console.log(extent);
      const grouped = group(shifts, (d: any) => d.date_start.getFullYear());
      const maxDuration = 10 * 3600 * 1000; // d3.max(shifts, (d: any) => d.duration);
      g.selectAll('g.year')
        .data(Array.from(grouped), (d) => d[0])
        .join(
          (s) =>
            s
              .append('g')
              .classed('year', true)
              .call((ss) => {
                ss.append('text')
                  .attr('text-anchor', 'end')
                  .attr('x', 76)
                  .attr('y', -20)
                  .text((d) => d[0]);
                ss.append('g')
                  .attr('transform', `translate(${80 + 0.5},0)`)
                  .classed('data', true);
                ss.append('g')
                  .attr('transform', `translate(${80 + 0.5},0)`)
                  .classed('months', true);
                ss.append('g')
                  .classed('days', true)
                  .selectAll('text')
                  .data((d) => {
                    const fd = new Date(d[0], 0, 1).getDay();
                    return d3
                      .range(7)
                      .map((i) => new Date(d[0], 0, i - fd + 1));
                  })
                  .join('text')
                  .attr('text-anchor', 'end')
                  .attr('alignment-baseline', 'middle')
                  .attr('x', 76)
                  .attr('y', (d: any) => hi / 2 + d.getDay() * hi)
                  .text((d) =>
                    d.toLocaleDateString('en-us', { weekday: 'short' })
                  );
              }),
          (s) => s,
          (s) => s.remove()
        )
        .call((s) =>
          s
            .select('.months')
            .selectAll('g')
            .data((d) =>
              d3.timeMonth.range(
                d3.timeMonth(d[1][0].date),
                d[1][d[1].length - 1].date
              )
            )
            .join((ss) =>
              ss.append('g').call((sss) => {
                sss
                  .filter((d, i) => i !== 0)
                  .append('path')
                  .attr('fill', 'none')
                  .attr('stroke', '#fafafa')
                  .attr('stroke-width', 3);
                sss.append('text').attr('y', -20);
              })
            )
            .call((ss) => {
              ss.select('path').attr('d', (d) => pathMonth(d, hi));
            })
            .call((ss) =>
              ss
                .select('text')
                .attr(
                  'x',
                  (d: any) =>
                    d3.timeWeek.count(d3.timeYear(d), d3.timeWeek.ceil(d)) *
                      hi +
                    2
                )
                .text((d) => d.toLocaleDateString('en-us', { month: 'short' }))
            )
        )
        .attr('transform', (d, i) => `translate(0,${h * i + p * (i + 1)})`)
        .select('g.data')
        .selectAll('g.datum')
        .data(
          (d) => d[1],
          (d: any) => d.id
        )
        .join(
          (s) =>
            s
              .append('g')
              .classed('datum', true)
              .call((ss) => {
                ss.append('rect')
                  .attr('width', hi - 1)
                  .attr('height', hi - 1)
                  .attr(
                    'x',
                    (d) =>
                      d3.utcSunday.count(
                        d3.utcYear(d.date_start),
                        d.date_start
                      ) *
                        hi +
                      0.5
                  )
                  .attr('y', (d) => d.date.getDay() * hi + 0.5);
                ss.append('title').text(
                  (d) =>
                    `${formatDate(d.date)}: ${(d.duration / 3.6e6).toFixed(
                      2
                    )} hours`
                );
              }),
          (s) => s,
          (s) => s.remove()
        )
        .attr('fill', (d) => color(Math.min(1, d.duration / +maxDuration)))
        .on('click', (d) => this.navigateTo(d));
    });
  }

  navigateTo({ date }: { date: Date }) {
    const s = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(
      '-'
    );
    this.router.navigate(['/timeclock'], { queryParams: { date: s } });
  }
}

function pathMonth(t, size) {
  const d = Math.max(0, Math.min(7, t.getDay()));
  const w = d3.timeSunday.count(d3.timeYear(t), t);
  return `${
    d === 0
      ? `M${w * size},0`
      : d === 7
      ? `M${(w + 1) * size},0`
      : `M${(w + 1) * size},0V${d * size}H${w * size}`
  }V${7 * size}`;
}

function formatDate(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');
}
