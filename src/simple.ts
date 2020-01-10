import * as d3 from 'd3';
import { getData, ShiftState } from './data';


document.addEventListener('DOMContentLoaded', () => main());

const colors = {
    lightBlue: '#cfe2f3',
    darkBlue: '#6fa8dc',
    lightGreen: '#93c47d',
};

function main() {
  const now = new Date();
  const data = getData(now);


  const svg = d3.select('svg');

  const {width, height} = (svg.node() as any).getBoundingClientRect();

  const recordHeight = 40;

  const zoom = d3.zoom().on('zoom', zoomed);
  const timeScale = d3.scaleTime()
    .range([0, width])
    .domain(centerOnDate(now));

  let timeAxis = d3.axisTop(timeScale);

  svg.append('g').classed('x', true)
    .call(timeAxis)
    .attr('transform', `translate(0,${recordHeight})`);


  console.log(ShiftState);
  console.log(data);
  svg.append('g')
    .classed('records', true)
    .attr('transform', `translate(0,${recordHeight})`)
    .selectAll('.record').data(data, (d: any) => d.id)
    .join(
      enter => enter.append('g')
        .classed('record', true)
        .call(s => {
          s.append('rect').classed('fg', true).attr('height', recordHeight)
            .append('title').text(d => d.employee.name.first + ' ' + d.employee.name.last)
          s.append('text')
            .attr('y', recordHeight / 2)
            .classed('name', true)
            .text(d => d.employee.name.first + ' ' + d.employee.name.last)
          s.append('text')
            .attr('y', recordHeight / 2)
            .classed('time start', true)
            .text(d => formatTime(d.shift.state === ShiftState.Upcoming ? d.shift.typical.start : d.shift.actual.start));
          s.append('text')
            .attr('y', recordHeight / 2)
            .classed('time end', true)
            .text(d => formatTime(d.shift.state === ShiftState.Complete ? d.shift.actual.end : d.shift.typical.end));
          return s;
        }),
      update => update,
      exit => exit.remove(),
    )
    .each(g(timeScale));

  function g(scale) {
    return function f(d, i) {
      const { state, actual, typical } = d.shift;
      switch (state) {
        case ShiftState.InProgress: {
          const [x, x0] = [scale(actual.start), scale(now)];
          const x1 = scale(typical.end);
          d.pos.x = x;
          d.pos.y = 2 + i * (recordHeight + 2);
          d.pos.w = x0 - x;
          d.pos.w1 = x1 - x;
          break;
        }
        case ShiftState.Complete: {
          const [x0, x1] = [scale(actual.start), scale(actual.end)];
          d.pos.x = x0;
          d.pos.y = 2 + i * (recordHeight + 2);
          d.pos.w = x1 - x0;
          break;
        }
        case ShiftState.Upcoming: {
          const [x0, x1] = [scale(typical.start), scale(typical.end)];
          d.pos.x = x0;
          d.pos.y = 2 + i * (recordHeight + 2);
          d.pos.w = x1 - x0;
          break;
        }
      }
      const sel = d3.select(this);
      sel.select('text.name')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('transform', (d: any) => `translate(${d.pos.x + (d.shift.state === ShiftState.InProgress ? d.pos.w1 : d.pos.w) / 2},${d.pos.y})`);
      sel.select('text.time.start')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('transform', (d: any) => `translate(${d.pos.x},${d.pos.y})`);
      sel.select('text.time.end')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('transform', (d: any) => `translate(${d.pos.x + (d.shift.state === ShiftState.InProgress ? d.pos.w1 : d.pos.w)},${d.pos.y})`);
      sel.select('rect.fg')
        .attr('fill', (d: any) => d.shift.state !== ShiftState.Upcoming ? colors.darkBlue: colors.lightBlue)
        .attr('transform', (d: any) => `translate(${d.pos.x},${d.pos.y})`)
        .attr('width', (d: any) => d.pos.w);
      sel.filter((d: any) => d.shift.state === ShiftState.InProgress).append('rect')
        .attr('height', recordHeight).classed('bg', true);
      sel.select('rect.bg')
        .attr('fill', colors.lightBlue)
        .attr('transform', (d: any) => `translate(${d.pos.x},${d.pos.y})`)
        .attr('width', (d: any) => d.pos.w1)
        .lower()
    }
  }

  function zoomed() {
    const newTimeScale = d3.event.transform.rescaleX(timeScale);
    timeAxis = timeAxis.scale(newTimeScale);
    const [a, b] = timeAxis.scale().domain().map(d => (d as Date).toISOString());

    svg.select('g.x').call(timeAxis);
    svg.select('g.records').selectAll('g.record').each(g(newTimeScale));
  }

  svg.call(zoom);

  // const s = g.selectAll('.record').data(data, (d: any) => d.id)
  //   .join(
  //     enter => enter.append('g'),
  //     update => update.call(sel => sel.select('g.fg')),
  //     exit => exit.remove(),
  //   );


  // complete
  // upcoming
  // inprogress

  // handle scale changes (linear, log)

  // handle zooming

  // handle more / different data
  //    different zoom region
  //    time passing
}

function formatTime(d: Date): string {
  return `${d.getHours() || 12}:${('0' + d.getMinutes()).slice(-2)}`;
}


function centerOnDate(date: Date, hoursWidth = 8): [Date, Date] {
  return [addHours(date, -hoursWidth / 2), addHours(date, hoursWidth / 2)];
}

function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

