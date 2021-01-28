import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { takeUntil, pluck, take } from 'rxjs/operators';
import * as d3 from 'd3';

import { BaseGraphComponent } from '../../components/base-graph/base-graph.component';
import { ProdScheduleGraphDialogComponent } from '../prod-schedule-graph-dialog/prod-schedule-graph-dialog.component';

enum OperationType {
  Operation = 'operation',
  Assembly = 'assembly',
}

interface OperationSegment {
  employeeID: string;
  dateStart: Date;
  dateStop: Date;
}

interface Operation {
  id: string;
  type: OperationType;
  category?: string;
  complete: boolean;
  available: boolean;
  prerequisites: string[];
  frac?: number;
  segments: OperationSegment[];
  dateStart: Date;
  dateAvailable: Date;
  dateComplete: Date;
}

interface Assembly {
  id: string;
  name: string;
  subassemblies: Assembly[];
  operations: Operation[];
}

interface LegendValue {
  id: string;
  name: string;
  color: {
    active: string;
    inactive: string;
  };
}

/*
const DONE = 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z';
const REMOVE =
  'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';
*/

@Component({
  selector: 'app-prod-schedule-graph',
  template: ` <div class="controls">
      <form [formGroup]="form">
        <mat-radio-group aria-label="Modes" formControlName="mode">
          <mat-radio-button value="stage">Group By Stage</mat-radio-button>
          <mat-radio-button value="time">Relative Time</mat-radio-button>
        </mat-radio-group>
      </form>
    </div>
    <svg #svg></svg>`,
  styleUrls: ['./prod-schedule-graph.component.scss'],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .controls {
        display: flex;
        padding: 18px;
      }
      svg {
        display: block;
        flex: auto 1 1;
      }
    `,
  ],
})
export class ProdScheduleGraphComponent
  extends BaseGraphComponent
  implements AfterViewInit {
  form = this.fb.group({ mode: ['stage'] });

  constructor(public dialog: MatDialog, public fb: FormBuilder) {
    super();
  }

  data: Assembly[] = Array.from(Array(4)).map((_, i) => {
    const name = `Assembly ${i + 1}`;
    const id = name.split(' ').join('_').toLowerCase();
    const date0 = d3.timeHour.offset(d3.timeDay.floor(new Date()), 6);
    const date1 = d3.timeHour.offset(date0, 1);
    const date2 = d3.timeHour.offset(date1, 2);
    // const date3 = d3.timeHour.offset(date2, 2);
    // const date4 = d3.timeMinute.offset(date3, 40);

    const subassemblies = [
      {
        name: 'Component 1',
        id: 'component_1',
        operations: [
          {
            id: 'component_1_op_0',
            type: OperationType.Operation,
            category: 'stage_1',
            prerequisites: [],
            available: true,
            complete: true,
            segments: [],
            dateAvailable: date0,
            dateStart: date0,
            dateComplete: date1,
          },
          {
            id: 'component_1_op_1',
            type: OperationType.Operation,
            category: 'stage_2',
            prerequisites: ['component_1_op_0'],
            available: true,
            complete: true,
            segments: [],
            dateAvailable: date1,
            dateStart: date1,
            dateComplete: date2,
          },
          {
            id: 'component_1_op_2',
            type: OperationType.Operation,
            category: 'stage_3',
            prerequisites: ['component_1_op_1'],
            available: true,
            complete: false,
            segments: [],
            dateAvailable: date2,
            dateStart: null,
            dateComplete: null,
          },
        ],
        subassemblies: [],
      },
      {
        name: 'Component 2',
        id: 'component_2',
        operations: [
          {
            id: 'component_2_op_0',
            type: OperationType.Operation,
            category: 'stage_1',
            prerequisites: [],
            available: true,
            complete: true,
            segments: [],
            dateAvailable: date0,
            dateStart: date0,
            dateComplete: date1,
          },
          {
            id: 'component_2_op_1',
            type: OperationType.Operation,
            category: 'stage_2',
            prerequisites: ['component_2_op_0'],
            available: true,
            complete: false,
            frac: 60,
            segments: [],
            dateAvailable: date1,
            dateStart: date1,
            dateComplete: null,
          },
        ],
        subassemblies: [],
      },
      {
        name: 'Component 3',
        id: 'component_3',
        operations: [
          {
            id: 'component_3_op_0',
            type: OperationType.Operation,
            category: 'stage_1',
            prerequisites: [],
            available: true,
            complete: true,
            segments: [],
            dateAvailable: date0,
            dateStart: date0,
            dateComplete: date1,
          },
          {
            id: 'component_3_op_1',
            type: OperationType.Operation,
            category: 'stage_3',
            prerequisites: ['component_3_op_0'],
            available: true,
            complete: false,
            segments: [],
            dateAvailable: date1,
            dateStart: null,
            dateComplete: null,
          },
        ],
        subassemblies: [],
      },
    ];
    const operations = [
      {
        id: `${id}_op_0`,
        type: OperationType.Assembly,
        prerequisites: ['component_1', 'component_2', 'component_3'],
        available: false,
        complete: false,
        segments: [],
        dateAvailable: null,
        dateStart: null,
        dateComplete: null,
      },
      {
        id: `${id}_op_1`,
        type: OperationType.Operation,
        category: 'stage_4',
        prerequisites: [`${id}_op_0`],
        available: false,
        complete: false,
        segments: [],
        dateAvailable: null,
        dateStart: null,
        dateComplete: null,
      },
      {
        id: `${id}_op_2`,
        type: OperationType.Operation,
        category: 'stage_5',
        prerequisites: [`${id}_op_1`],
        available: false,
        complete: false,
        segments: [],
        dateAvailable: null,
        dateStart: null,
        dateComplete: null,
      },
    ];
    return { id, name, operations, subassemblies };
  });

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const g = this.svg.append('g').attr('transform', `translate(${40},${40})`);

    const rowHeight = 300;

    const legendValues = [];
    const legend = {};
    for (let i = 0; i < 10; i += 2) {
      const color = {
        active: d3.schemePaired[i + 1],
        inactive: d3.schemePaired[i],
      };
      const name = `Stage ${Math.floor(i / 2 + 1)}`;
      const id = name.split(' ').join('_').toLowerCase();
      const obj = { name, id, color };
      legendValues.push(obj);
      legend[id] = obj;
    }
    g.append('g')
      .classed('legend', true)
      .selectAll<any, LegendValue>('g')
      .data(legendValues, (d) => d.id)
      .join((s) =>
        s.append('g').call((ss) => {
          ss.append('rect')
            .attr('ry', 2)
            .attr('y', -10)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', (d) => d.color.active);
          ss.append('text')
            .attr('alignment-baseline', 'middle')
            .attr('x', 24)
            .text((d) => d.name);
        })
      )
      .attr('transform', (_, i) => `translate(${i * 100},0)`);

    const gData = g.append('g').attr('transform', `translate(0,${40})`);

    const paddingX = 8;
    const paddingY = 20;
    const height = 36;
    const width = 140;

    const fn = this.open.bind(this);
    const draw = (data: Assembly[]) => {
      gData
        .selectAll<any, Assembly>('g')
        .data(data, (d) => d.id)
        .join((s) =>
          s.append('g').call((ss) => {
            ss.append('text').text((d) => d.name);
          })
        )
        .attr('transform', (_, i) => `translate(0,${i * rowHeight})`)
        .each(function (dd) {
          const s = d3.select(this);

          const { rects } = calculatePositions(dd);

          s.selectAll<any, any>('g.rect')
            .data(rects)
            .join((ss) =>
              ss
                .append('g')
                .classed('rect', true)
                .call((sss) => sss.append('text'))
            )
            .call((ss) =>
              ss
                .selectAll('rect')
                .data((d) => {
                  const colors = legend[d.op.category].color;
                  return d.op.available && !d.op.complete && d.op.frac
                    ? [
                        {
                          w: 1,
                          stroke: colors.inactive,
                          color: colors.inactive,
                          animate: false,
                        },
                        {
                          w: d.op.frac / 100,
                          color: colors.active,
                          stroke: colors.inactive,
                          animate: false,
                        },
                      ]
                    : [
                        {
                          w: 1,
                          color: d.op.complete
                            ? colors.active
                            : colors.inactive,
                          stroke: colors.inactive,
                          animate:
                            !d.op.complete && !d.op.frac && d.op.available,
                        },
                      ];
                })
                .join((sss) =>
                  sss
                    .append('rect')
                    .attr('stroke-width', 4)
                    .attr('height', height)
                    .attr('x', paddingX)
                    .attr('y', paddingY)
                    .attr('rx', 4)
                )
                .attr('width', (d) => d.w * width)
                .attr('fill', (d) => d.color)
                .attr('stroke', (d) => d.stroke)
                .call((sss) =>
                  sss
                    .selectAll('animate')
                    .data((ddd) => (ddd.animate ? [ddd.color] : []))
                    .join((ssss) =>
                      ssss
                        .append('animate')
                        .attr('attributeType', 'XML')
                        .attr('attributeName', 'stroke')
                        .attr('values', (ddd) => [ddd, 'black', ddd].join('; '))
                        .attr('dur', '1.2s')
                        .attr('repeatCount', 'indefinite')
                    )
                )
            )
            .call((ss) =>
              ss
                .selectAll('g.symbol')
                .data((ddd) =>
                  ddd.op.complete
                    ? ['complete']
                    : !ddd.op.available
                    ? ['incomplete']
                    : []
                )
                .join((sss) =>
                  sss
                    .append('g')
                    .attr(
                      'transform',
                      `translate(${width / 2},${height / 2 + 8})`
                    )
                    .classed('symbol', true)
                    .call((ssss) => {
                      ssss
                        .append('svg')
                        .attr('fill', 'white')
                        .attr('width', 24)
                        .attr('height', 24)
                        .append('use');
                    })
                )
                .select('svg > use')
                .attr(
                  'href',
                  (ddd) =>
                    `/assets/${
                      ddd === 'complete' ? 'done' : 'clear'
                    }-24px.svg#path`
                )
            )
            .attr(
              'transform',
              (ddd) =>
                `translate(${paddingX + ddd.x * (width + paddingX * 2)},${
                  paddingY + ddd.y * (height + paddingY * 2)
                })`
            )
            .on('click', (ddd) => fn(ddd));
        });
    };

    draw(this.data);

    const mode$ = this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      // startWith(this.form.value),
      pluck('mode')
    );

    mode$.pipe(take(1)).subscribe((value) => {
      console.log(value);
    });
  }

  open(data) {
    this.dialog.open(ProdScheduleGraphDialogComponent, {
      data,
    });
  }
}

function calculatePositions(d) {
  let rows = -1;
  const rowMap = {};
  d3.hierarchy(d, (dd) => dd.subassemblies).each((n) => {
    rowMap[n.data.id] = Math.max(rows++, 0);
  });

  const h = d3.hierarchy(
    {
      x: 0,
      y: 0,
      op: d.operations[d.operations.length - 1],
      assembly: d,
    },
    (dd) =>
      dd.op.type === OperationType.Operation
        ? dd.op.prerequisites.map((id) => ({
            x: 0,
            y: 0,
            op: dd.assembly.operations.find((op) => id === op.id),
            assembly: dd.assembly,
          }))
        : dd.op.prerequisites.map((id) => {
            const sub = dd.assembly.subassemblies.find(
              (subb) => id === subb.id
            );
            const op = sub.operations[sub.operations.length - 1];
            return { x: 0, y: 0, op, assembly: sub };
          })
  );

  const stages = [];
  const rects = [];

  h.eachAfter((l) => {
    const { category } = l.data.op;
    if (category) {
      let i = stages.indexOf(category);
      if (i === -1) {
        i = stages.push(category) - 1;
      }
      l.data.x = i;
      l.data.y = rowMap[l.data.assembly.id];
      rects.push(l.data);
    }
  });

  return { rects, stages };
}
