import * as d3 from 'd3';
import { formatDuration, formatTime, inFieldOfView, throttle } from './util';
import { ShiftState, Shift, Employee, ShiftComponent, ShiftComponentType, EmployeeID } from './models';
import * as Comlink from 'comlink';

const worker = Comlink.wrap(new Worker('./data.worker.ts', { type: 'module' })) as any;

const LOCALE = 'en';
const defaultExtent: [[number, number], [number, number]] = [[-Infinity,-Infinity], [Infinity, Infinity]];

const svg: d3.Selection<SVGElement, {}, HTMLElement, any> = d3.select('svg');

// all shifts
const shifts: Shift[] = [];
// all employees
const employees: Employee[] = [];

// set "now" to Wed at 2:22
const now = d3.timeWeek.floor(new Date());
now.setDate(now.getDate() + 3);
now.setHours(14, 22, 0, 0);

const today = d3.timeDay.floor(new Date(now));

let width, height;
let xScale, topAxis, bottomAxis;
// let xScale = d3.scaleTime();
// let topAxis = d3.axisTop(xScale);
// let bottomAxis = d3.axisBottom(xScale);

let yScale;
const bandwidth = 30;
const rowTextHeight = 20;
const step = 64;


const colorScale = d3.scaleOrdinal();
{
  const colors = d3.schemePaired.slice(0, 10);
  const pairs = [];
  for (let i = 0; i < colors.length; i+=2) {
    const pair = [colors[i+1], colors[i]];
    pairs.push(pair);
  }
  colorScale.domain(pairs.map((_, i) => i.toString())).range(pairs);
}

let zoom;
const margin = {left: 10, right: 10, top: 80, bottom: 40};


size();


let darkMode = false;

svg.append('rect').classed('background', true).attr('height', '100%').attr('width', '100%');
svg.append('g').classed('shifts', true).attr('transform', `translate(0,${margin.top})`);

// drawButton('Dark Mode', [120, 36])
//   .attr('transform', `translate(${width - 264},${4})`)
//   .on('click', () => svg.classed('dark', darkMode = !darkMode));
// 
// drawButton('Reset', [120, 36])
//   .attr('transform', `translate(${width - 134},${4})`)
//   .on('click', () => svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity));


 
let xScaleCopy, yScaleCopy;


function size() {
  ({ width, height } = svg.node().getBoundingClientRect());
}

function byTime([minDate, maxDate]) {
  // setup
  svg.call(zoom = d3.zoom()
    .translateExtent(defaultExtent)
    .scaleExtent([.4, 100])
    .on('zoom', zoomed));
  xScale = d3.scaleTime().domain([minDate, maxDate]).range([margin.left, width - margin.right]);
  xScaleCopy = xScale.copy();
  yScale = d3.scaleOrdinal<number>();
  topAxis = d3.axisTop(xScale);
  bottomAxis = d3.axisBottom(xScale);

  topAxis.scale(xScale);
  bottomAxis.scale(xScale);


  let s;
  if ((s = svg.select('g.axis.top')).empty()) {
    s = svg.append('g').classed('axis top', true);
  }
  s.call(topAxis);

  if ((s = svg.select('g.axis.bottom')).empty()) {
    s = svg.append('g').classed('axis bottom', true);
  }
  s.call(bottomAxis);
 
  let dateAxis;
  if (dateAxis = svg.select('g.axis.date')) {
    dateAxis = svg.append('g').classed('axis date', true);
  }

  drawAxis();

  worker.getShiftsInRange([minDate, maxDate]).then(({shifts, employeeIds, employees}) => {
    draw(shifts, employeeIds, employees);
  });

  function draw(shifts: Shift[], employeeIds: EmployeeID[], employees: {[id: string]: Employee}) {
    yScale.domain(employeeIds).range(Array.from(Array(employeeIds.length)).map((_, i) => i));

    shifts.forEach(updatePositions);


    const t = d3.transition().duration(500);

    svg.select('g.shifts').raise().selectAll<SVGElement, Shift>('g.shift').data(shifts, d => d.id)
      .join(
        enter => enter.append('g')
          .call(drawShift, bandwidth)
          .call(s => s.select('g.text').attr('transform', d => `translate(${d.x+4},${-rowTextHeight})`))
          .call(s => s.selectAll<SVGElement, ShiftComponent>('g.group')
            .attr('transform', d => `translate(${d.x},0)`)
            .call(s => s.select('rect')
              .attr('width', d => d.w)
              .attr('fill', d => d.fill.toString())
              .attr('stroke', d => d.fill.toString())
            )
            .call(s => s.select('text.time.start')
              .attr('opacity', d => d.w > 120 ? 1 : 0)
            )
            .call(s => s.select('text.time.end')
              .attr('opacity', d => d.w > 200 ? 1 : 0)
              .attr('x', d => d.w - 4)
            )
          )
          .each(function (d) {
            d3.select(this)
              .attr('opacity', 0)
              .attr('transform', `translate(0,${d.y + 40})`)
              .transition(t)
              .delay(200)
              .attr('opacity', 1)
              .attr('transform', `translate(0,${d.y})`)
          }),
        update => update
          .call(s => s.selectAll('g.group').data(d => d.components))
          .call(s => s.transition(t).delay(100)
          .call(s => s.select('g.text').each(function (d) {
            const s = d3.select(this);
            const text = s.select<SVGGraphicsElement>('text')
              .text((d: any) => d.employee.name);
            const dx = text.node().getBBox().width + 4;
            s.select('g.duration').attr('transform', `translate(${dx},0)`);
          }))
          .call(s => s.select('g.text').attr('transform', (d: any) => `translate(${d.x+4},${-rowTextHeight})`))
          .attr('transform', d => `translate(0,${d.y})`)
          .selectAll<SVGElement, ShiftComponent>('g.group')
            .attr('transform', d => `translate(${d.x},0)`)
            .call(s => s.select('rect')
              .attr('width', d => d.w)
              .attr('fill', d => d.fill.toString())
              .attr('stroke', d => d.fill.toString())
            )
            .call(s => s.select('text.time.start')
              .attr('opacity', d => d.w > 120 ? 1 : 0))
            .call(s => s.select('text.time.end')
              .attr('opacity', d => d.w > 200 ? 1 : 0)
              .attr('x', d => d.w - 4))),
        exit => exit.attr('opacity', 1).transition(t).attr('opacity', 0).remove(),
      )
      .on('click', function(d) {
        d3.select(this).on('click', null); // probs should be in byEmployee
        cleanup();
        byEmployee(d.employee.id, d.start);
      });
  };

  function updatePositions(shift: Shift) {
    for (const comp of shift.components) {
      const x = xScale(comp.start);
      const index = comp.type == ShiftComponentType.Projected ? 1 : 0;
      const fill = colorScale(shift.employee.id)[index];
      comp.fill = d3.color(fill)
      comp.x = x;
      comp.w = xScale(comp.end) - comp.x;
    }
    shift.y = yScale(shift.employee.id) * step + rowTextHeight;
    const [a, b] = [xScale(shift.start), xScale(shift.end)];
    shift.x = Math.min(Math.max(a, 0), b);
    return shift;
  }

  // const throttledRedraw = throttle(
  //   async ([minDate, maxDate]) => {
  //     console.log(minDate, maxDate);
  //     byTime([minDate, maxDate], false, false);
  //   },
  //   () => {},
  // );

  function zoomed() {
    xScale = d3.event.transform.rescaleX(xScaleCopy);
    topAxis = topAxis.scale(xScale);
    bottomAxis = bottomAxis.scale(xScale);
    drawAxis();
    
    svg.select('g.shifts').selectAll<SVGElement, Shift>('g.shift')
      .each(updatePositions)
      .attr('transform', shift => `translate(0,${shift.y})`)
      .call(s => s.select('g.text').attr('transform', d => `translate(${d.x + 4},${-rowTextHeight})`))
      .call(s => s.selectAll<SVGElement, ShiftComponent>('g.group')
        .attr('transform', d => `translate(${d.x},0)`)
        .call(s => s.select('rect').attr('width', d => d.w))
        .call(s => s.select('text.time.start').attr('opacity', d => d.w > 120 ? 1 : 0))
        .call(s => s.select('text.time.end').attr('opacity', d => d.w > 200 ? 1 : 0).attr('x', d => d.w - 4))
      );
    // throttledRedraw(xScale.domain());
  }

  function cleanup() {
    // clearTimeout(throttledRedraw.timeout);
    svg.select('g.axis.date').remove();
  }
}

function drawStrokeAnimation(sel, colors: string[]) {
  const values = [...colors, colors[0]].join(';');
  return sel.append('animate')
    .attr('attributeType', 'XML')
    .attr('attributeName', 'stroke')
    .attr('values', values)
    .attr('dur', '1.2s')
    .attr('repeatCount', 'indefinite');
}

function drawShift(sel, bandwidth) {
  return sel
    .classed('shift', true)
    .attr('cursor', 'pointer')
    // shift label
    .call(s => s.append('g').classed('text', true)
      .call(s => s.append('text')
        .classed('shift-label', true)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'bottom')
        .text(d => d.employee.name)
      )
      .filter(d => d.started)
      .call(s => s.append('g').classed('duration', true)
        .each(function (d) {
          const dx = (this.previousSibling as SVGGraphicsElement).getBBox().width + 4;
          d3.select(this)
            .attr('transform', `translate(${dx},0)`)
            .call(drawMiniPie, d.duration / d.expectedDuration, d.employee.id);
        })
        .call(s => s.append('text')
          .attr('x', 24)
          .attr('y', 10)
          .attr('alignment-baseline', 'bottom')
          .text(d => `${formatDuration(d.duration)}`)
        ),
      )
    )
    // shift components
    .call(s => s.selectAll('g.group').data(d => d.components).enter().append('g').classed('group', true)
      .call(s => s.append('rect').attr('stroke-width', 4).attr('height', bandwidth).attr('rx', 8))
      .call(s => s.filter(d => d.showTime)
        .call(e => e.append('text')
          .classed('time start', true)
          .attr('alignment-baseline', 'middle')
          .attr('x', 4)
          .attr('y', bandwidth / 2)
          .text(d => formatTime(d.start))
        )
        .call(e => e.append('text')
          .classed('time end', true)
          .attr('text-anchor', 'end')
          .attr('alignment-baseline', 'middle')
          .attr('y', bandwidth / 2)
          .text(d => formatTime(d.end))
        )
      )
      .each(function (d) {
        if (d.type == ShiftComponentType.Actual && d.state == ShiftState.Incomplete) {
          d3.select(this).select('rect').call(drawStrokeAnimation, [d.fill.hex(), '#fff']);
        }
      })
    );
}

const arc = d3.arc();
function drawMiniPie(sel, frac: number, employeeId: string, radius = 10) {
  const c = colorScale(employeeId);
  const endAngle = 2 * Math.PI * Math.min(Math.max(frac, 0), 1);
  const startAngle = 0;
  return sel.append('g')
    .attr('transform', `translate(${radius},${radius/2})`)
    .call(s => s.append('circle').attr('r', 10).attr('fill', c[1]))
    .call(s => s.append('path').attr('fill', c[0])
      .attr('d', d => arc({ startAngle, endAngle, outerRadius: radius, innerRadius: 0 })));
}

function drawButton(text: string, [w, h]: [number, number]) {
  return svg.append('g')
    .classed('button', true)
    .call(g => g.append('rect')
      .attr('rx', 8)
      .attr('width', w)
      .attr('height', h))
    .call(g => g.append('text')
      .attr('user-select', 'none')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('x', w / 2)
      .attr('y', h / 2)
      .text(text)
    );
}

function byEmployee(employeeId, centerDate: Date) {
  let minDate = d3.timeWeek.floor(centerDate);
  let maxDate = d3.timeWeek.offset(minDate, 1);
  const domain = d3.timeDay.range(minDate, maxDate).map(d => d.toISOString().slice(0, 10));
  const j = domain.indexOf(centerDate.toISOString().slice(0, 10));
  yScale = d3.scaleTime();
  yScale.domain([minDate, maxDate]).range([0, height - margin.bottom]);
  yScaleCopy = yScale.copy();

  xScale = d3.scaleTime().range([margin.left, width - margin.right]);
  xScaleCopy = xScale.copy();
  // yScale.domain(domain).range(Array.from(Array(domain.length)).map((_, i) => i - j));


  // query db with employee, min/max date
  worker.getShiftsByEmployeeInRange([minDate, maxDate], employeeId).then(({employee, shifts}) => {
    draw(shifts, employee);
  });

  function draw(shifts: Shift[], employee: Employee) {
    const t = d3.transition().duration(500);

    let nameTitle;
    if (nameTitle = svg.select('g.title.block')) {
      nameTitle = svg.append('g').classed('title block', true)
        .attr('transform', `translate(${width / 2},${margin.top / 2})`)
        .call(s => s.append('text').attr('text-anchor', 'middle').attr('alignment-baseline', 'middle'));
    }

     // uggggly
    ([minDate, maxDate] = d3.extent(shifts
      .reduce((acc, s) => {
        for (const comp of s.components) {
          acc.push(comp.start);
          acc.push(comp.end);
        }
        return acc;
      }, [] as Date[])
      .map(normalizeDate)));

    const [minx, maxx] = xScale.range();
    const extent: [[number, number], [number,number]] = [
      [minx, -Infinity],
      [maxx, Infinity]
    ];

    svg.call(zoom = d3.zoom()
      .translateExtent(extent)
      .scaleExtent([1, 100])
      .on('start', zoomStarted)
      .on('end', zoomEnded)
      .on('zoom', zoomed));

  
    nameTitle.select('text').text(`${employee.name}:  Week of ${[minDate, maxDate].map(formatDateSimple).join(' - ')}`);

    xScale.domain([minDate, maxDate]);
    xScaleCopy = xScale.copy();

    topAxis.scale(xScale);
    bottomAxis.scale(xScale);

    svg.select('g.axis.top').attr('transform', `translate(0,${margin.top})`).call(topAxis)
      .call(s => s.select('path').remove())
      .call(s => s.selectAll('.tick').select('line').attr('y2', height - margin.top - 40));
    svg.select('g.axis.bottom').attr('transform', `translate(0,${height - 40})`).call(bottomAxis)
      .call(s => s.select('path').remove())
      .call(s => s.selectAll('.tick').select('line').remove());

    svg.select('g.shifts').selectAll<SVGElement, Shift>('g.shift').data(shifts, d => d.id).join(
      enter => enter.append('g')
        .each(updatePositions)
        .call(drawShift, bandwidth)
        .each(function (d) {
          d3.select(this)
            .attr('opacity', 0)
            .attr('transform', `translate(0,${d.y - 40})`)
            .transition(t)
            .delay(200)
            .attr('opacity', 1)
            .attr('transform', `translate(0,${d.y})`);
        })
        .call(s => s.select('g.text')
          .each(function (d) {
            const s = d3.select(this);
            const text = s.select<SVGGraphicsElement>('text').text(formatDate(d.start));
            const dx = text.node().getBBox().width + 4;
            s.select('g.duration').attr('transform', `translate(${dx},0)`);
          })
        )
        .call(s => s.select('g.text').attr('transform', d => `translate(${d.x + 4},${-rowTextHeight})`))
        .call(s => s.selectAll<SVGElement, ShiftComponent>('g.group')
          .attr('transform', d => `translate(${d.x},0)`)
          .call(s => s.select('rect')
            .attr('width', d => d.w)
            .attr('fill', d => d.fill.toString())
            .attr('stroke', d => d.fill.toString())
          )
          .call(s => s.select('text.time.start').attr('opacity', d => d.w > 120 ? 1 : 0))
          .call(s => s.select('text.time.end').attr('opacity', d => d.w > 200 ? 1 : 0).attr('x', d => d.w - 4))
        ),
      update => update
        .each(updatePositions)
        .call(s => s.selectAll('g.group').data(d => d.components))
        .call(s => s.transition(t).delay(100)
          .call(s => s.select('g.text')
            .each(function (d) {
              const s = d3.select(this);
              const text = s.select<SVGGraphicsElement>('text').text(formatDate(d.start));
              const dx = text.node().getBBox().width + 4;
              s.select('g.duration').attr('transform', `translate(${dx},0)`);
            })
          )
          .call(s => s.select('g.text').attr('transform', d => `translate(${d.x+4},${-rowTextHeight})`))
          .attr('transform', d => `translate(0,${d.y})`)
          .selectAll<SVGElement, ShiftComponent>('g.group')
          .attr('transform', d => `translate(${d.x},0)`)
          .call(s => s.select('rect')
            .attr('width', d => d.w)
            .attr('fill', d => d.fill.toString())
            .attr('stroke', d => d.fill.toString())
          )
          .call(s => s.select('text.time.start')
            .attr('opacity', d => d.w > 120 ? 1 : 0))
          .call(s => s.select('text.time.end')
            .attr('opacity', d => d.w > 200 ? 1 : 0)
            .attr('x', d => d.w - 4))
        ),
      exit => exit.attr('opacity', 1).transition(t).attr('opacity', 0).remove(),
    ).on('click', function (d) {
      d3.select(this).on('click', null);
      cleanup();
      byTime([d3.timeHour.offset(d.start, -2), d3.timeHour.offset(d.end, 2)]);
    });
  }

  function normalizeDate(d: Date) {
    d = new Date(d);
    d.setFullYear(2000);
    d.setMonth(0)
    d.setDate(1);
    return d;
  }

  function updatePositions(shift: Shift) {
    for (const comp of shift.components) {
      comp.fill = d3.color(colorScale(shift.employee.id)[comp.type == ShiftComponentType.Projected ? 1 : 0]);
      comp.x = xScale(normalizeDate(comp.start));
      comp.w = xScale(normalizeDate(comp.end)) - comp.x;
    }
    // const dy = (yScale(shift.start.toISOString().slice(0, 10)) - 1) * step;
    // shift.y = dy + (height - margin.bottom) / 2;
    shift.y = yScale(d3.timeDay.floor(shift.start));
    shift.x = Math.max(xScale(normalizeDate(shift.start)), 0);
    return shift;
  }

  let lastOffsetY = 0, currentOffset = 0, transform = d3.zoomIdentity;
  function zoomStarted() {
    const { sourceEvent } = d3.event;
    lastOffsetY = sourceEvent.type == "touchstart" ? sourceEvent.touches[0].screenY : sourceEvent.offsetY;
  }

  function zoomEnded() {
    currentOffset = transform.y;
  }

  function zoomed() {

    xScale = d3.event.transform.rescaleX(xScaleCopy);

    // manually compute the drag distance and create zoom transform
    // const { sourceEvent: { offsetY }} = d3.event;
    const { sourceEvent: {type, touches, offsetY} } = d3.event;
    const dy = (type == 'touchmove' ? touches[0].screenY : offsetY) - lastOffsetY + currentOffset;
    transform = d3.zoomIdentity.translate(0, dy);
    yScale = transform.rescaleY(yScaleCopy);

    topAxis = topAxis.scale(xScale);
    bottomAxis = bottomAxis.scale(xScale);
    drawAxis();
    
    const t = d3.zoomIdentity.translate(0, d3.event.transform.y).scale(d3.event.transform.k);

    svg.select('g.shifts')
      .selectAll<SVGElement, Shift>('g.shift')
      .each(updatePositions)
      .attr('transform', d => `translate(0,${d.y})`)
      .call(s => s.select('g.text').attr('transform', d => `translate(${d.x + 4},${-rowTextHeight})`))
      .call(s => s.selectAll<SVGElement, ShiftComponent>('g.group')
        .attr('transform', d => `translate(${d.x},0)`)
        .call(s => s.select('rect')
          .attr('width', d => d.w)
          .attr('fill', d => d.fill.toString())
          .attr('stroke', d => d.fill.toString())
        )
        .call(s => s.select('text.time.start')
          .attr('opacity', d => d.w > 120 ? 1 : 0))
        .call(s => s.select('text.time.end')
          .attr('opacity', d => d.w > 200 ? 1 : 0)
          .attr('x', d => d.w - 4))
      );
  }

  function cleanup() {
    svg.select('g.title.block').remove();
  }

}

{
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = new Date(today);
  start.setHours(4);

  const [minDate, maxDate] = [start, tomorrow];

  // getData(now, [minDate, maxDate])
  byTime([minDate, maxDate]);
}

function drawAxis() {
  svg.select('g.axis.top').attr('transform', `translate(0,${margin.top})`).call(topAxis)
    .call(s => s.select('path').remove())
    .call(s => s.selectAll('.tick').select('line').attr('y2', height - margin.top + 20 - margin.bottom));
  svg.select('g.axis.bottom').attr('transform', `translate(0,${height - margin.bottom})`).call(bottomAxis)
    .call(s => s.select('path').remove())
    .call(s => s.selectAll('.tick').select('line').remove());

  interface DateLabel {
    date: Date;
    id: string;
  }

  const labels: DateLabel[] = [];
  const [minDate, maxDate] = xScale.domain();
  const spacing = xScale(d3.timeDay.offset(minDate, 1)) - xScale(minDate);

  let date = new Date(minDate);
  date.setHours(0, 0, 0, 0);
  const stickyCenter = +maxDate - +minDate < 8.64e7;
  for (; date < maxDate; date.setDate(date.getDate() + 1)) {
    labels.push({ id: date.toISOString().slice(0, 10), date: new Date(date) });
  }

  svg.select('g.axis.date').selectAll<SVGElement, DateLabel>('g').data(labels, d => d.id)
    .join(
      enter => enter.append('g').call(s => s.append('text').classed('date-label', true).text(d => formatDate(d.date))),
      update => update,
      exit => exit.remove(),
    )
    .attr('transform', function (d, i) {
      const {width: w} = (d3.select(this).select('text').node() as SVGGraphicsElement).getBBox();
      const padding = w / 2 + 8;
      let x = xScale(d.date);
      if (stickyCenter) {
        x = Math.min(x + spacing - padding, Math.max(width / 2 - padding, x + padding));
      } else {
        x += spacing / 2 - padding;
      }

      return `translate(${x},${margin.top / 2})`;
    })
}


function formatDateSimple(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
}

function formatDate(date: Date) {
  const a = date.toLocaleDateString(LOCALE, { weekday: 'long' });
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${a} ${m}/${d}`;
}
