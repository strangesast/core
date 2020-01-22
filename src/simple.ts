import * as d3 from 'd3';
import * as Comlink from 'comlink';

import { colors, Employee, Shift, ShiftState, throttle, debounce, addHours, formatTime } from './util';

const worker = Comlink.wrap(new Worker('./data.worker.ts', { type: 'module' })) as any;

document.addEventListener('DOMContentLoaded', async () => {
  main();
});

function main() {
  let data;
  let width, height;

  const svg = d3.select('svg');

  ({width, height} = (svg.node() as any).getBoundingClientRect());

  const headerHeight = 40;

  const now = new Date(2020, 0, 3, 12, 0, 0, 0);
  const firstDateRange = centerOnDate(now);

  const zoom = d3.zoom()
    .on('zoom', zoomed);

  let timeScale = d3.scaleTime()
    .range([0, width])
    .domain(firstDateRange);

  let bandScale = d3.scaleBand()
    .range([headerHeight, height]);

  const timeScaleCopy = timeScale.copy();

  let timeAxis = d3.axisTop(timeScale);

  svg.append('g').classed('x time', true)
    .call(timeAxis)
    .attr('transform', `translate(0,${headerHeight})`);

  svg.append('g').classed('records', true);

  function updateViewWidth() {
    ({width, height} = (svg.node() as any).getBoundingClientRect());
    timeScale.range([0, width]);
    svg.select('g.x.time').call(timeAxis);
    redraw(data);
  }

  window.onresize = debounce(() => updateViewWidth(), 200);

  function redraw({shifts, employeeIds, employees}: {employees: {[id: string]: Employee}, shifts: Shift[], employeeIds: string[]}) {
    bandScale.domain(employeeIds).padding(0.1)

    shifts.forEach(updatePos);

    const t = d3.transition();

    svg.select('g.rows').selectAll('.row').data(employeeIds, (d: any) => d.id)
      .join(
        enter => enter,
        update => update,
        exit => exit.remove(),
      )

    svg.select('g.records')
      .selectAll('.record')
      .data(shifts, (d: any) => d.id)
      .join(
        enter => {
          const s = enter.append('g')
            .classed('record', true)
            .call(s => {
              s.append('rect')
                .classed('fg', true)
                .append('title')
                .text(d => d.display.center)
              const g = s.append('g').classed('text', true);
              g.append('text').attr('class', 'time left').text(d => d.display['left']);
              g.append('text').attr('class', 'time center').text(d => d.display['center']);
              g.append('text').attr('class', 'time right').text(d => d.display['right']);
            });
          s.call(updateSel).attr('opacity', 0).transition(t).attr('opacity', 1);
          return s;
        },
        update => update.call(s => s.transition(t).call(updateSel)),
        exit => exit.call(s => s.transition(t).attr('opacity', 0).remove()),
      );
  }

  const throttledUpdate = throttle(
    async ([fromDate, toDate]) => worker.getData([fromDate, toDate]),
    newData => redraw(data = newData),
  );

  function zoomed() {
    timeScale = d3.event.transform.rescaleX(timeScaleCopy);
    timeAxis = timeAxis.scale(timeScale);

    svg.select('g.x.time')
      .call(timeAxis);

    svg.select('g.records').selectAll('g.record')
      .each(updatePos)
      .call(updateSel);

    const domain = timeAxis.scale().domain().map(d => (d as Date));
    throttledUpdate(domain);
  }

  function updatePos(d, i) {
    const { state, actual, typical } = d.shift;
    let y, x, x0, x1, w, w1;
    switch (state) {
      case ShiftState.InProgress: {
        x = timeScale(actual.start);
        x0 = timeScale(now);
        x1 = timeScale(typical.end);
        w = Math.max(x0 - x, 0); // disgusting
        w1 = Math.max(x1 - x, 0);
        break;
      }
      case ShiftState.Complete: {
        x = timeScale(actual.start);
        x0 = timeScale(actual.end);
        w = x0 - x;
        break;
      }
      case ShiftState.Upcoming: {
        x = timeScale(typical.start);
        x0 = timeScale(typical.end);
        w = x0 - x;
        break;
      }
    }
    d.pos.x = x;
    d.pos.y = bandScale(d.employee.id) || 0;
    d.pos.w = w;
    d.pos.w1 = w1;
  }

  function updateSel(sel) {
    const dy = bandScale.step() / 2;
    const h = bandScale.bandwidth();

    sel.select('text.center')
      .attr('text-anchor', 'middle')
      .attr('transform', (d: any) => {
        let x = d.pos.x + (d.shift.state === ShiftState.InProgress ? d.pos.w1 : d.pos.w) / 2;
        x = Math.min(Math.max(x, 80), width - 80);
        return `translate(${x},${dy})`;
      });

    sel.select('text.time.left')
      .attr('text-anchor', 'start')
      .attr('transform', (d: any) => `translate(${d.pos.x},${dy})`);

    sel.select('text.time.right')
      .attr('text-anchor', 'end')
      .attr('transform', (d: any) => {
        const x = d.pos.x + (d.shift.state === ShiftState.InProgress ? d.pos.w1 : d.pos.w);
        return `translate(${x},${dy})`;
      });

    sel.select('g.text').attr('transform', d => `translate(0,${d.pos.y})`);

    sel.select('rect.fg')
      .attr('fill', (d: any) => d.shift.state !== ShiftState.Upcoming ? colors.darkBlue: colors.lightBlue)
      .attr('transform', (d: any) => `translate(${d.pos.x},${d.pos.y})`)
      .attr('height', h)
      .attr('width', (d: any) => d.pos.w);
    //sel.filter((d: any) => d.shift.state === ShiftState.InProgress).append('rect')
    //  .attr('height', bandScale.bandwidth()).classed('bg', true);
    sel.select('rect.bg')
      .attr('fill', colors.lightBlue)
      .attr('transform', (d: any) => `translate(${d.pos.x},${d.pos.y})`)
      .attr('width', (d: any) => d.pos.w1)
      .attr('height', h);
    // .lower()
  }

  worker.getData(firstDateRange).then(newData => redraw(data = newData));

  svg.call(zoom);
}


function centerOnDate(date: Date, hoursWidth = 8): [Date, Date] {
  return [addHours(date, -hoursWidth / 2), addHours(date, hoursWidth / 2)];
}
