import * as Comlink from 'comlink';
import { ShiftState, formatTime, addHours } from './util';

async function get(key) {
  const res = await fetch(`data/${key}.json`);
  const json = await res.json();
  return json;
}

function inFieldOfView([start, end], [fromDate, toDate]): boolean {
  if (start > fromDate && start < toDate) return true; // start side
  if (end == null) return true; // in progress
  if (end > fromDate && end < toDate) return true; // end side
  if (start < fromDate && end > toDate) return true;
  return false;
}

const obj = {
  data: {
    shifts: get('shifts').then(arr => {
      for (const each of arr) {
        each['start'] = new Date(each['start']);
        each['end'] = each['end'] != null ? new Date(each['end']) : null;
      }
      return arr;
    }),
    employees: get('employees').then(arr => {
      return Object.values(arr).reduce((acc, {id, Code, Name, MiddleName, LastName}) => {
        acc[id] = {id, name: {first: Name, last: LastName}};
        return acc;
      }, {});
    }),
  },
  async getData([fromDate, toDate]) {
    const shifts = await obj.data.shifts;
    const employees = await obj.data.employees;
    const subset = [];
    const employeeIds = new Set();
    for (const shift of shifts) {
      if (inFieldOfView([shift.start, shift.end], [fromDate, toDate])) {
        const employee = employees[shift.employee];
        employeeIds.add(shift.employee);
        let state, typicalEnd = null;
        if (shift.end != null) {
          state = ShiftState.Complete;
        } else {
          typicalEnd = new Date(shift.start);
          typicalEnd.setHours(typicalEnd.getHours() + 8);
          state = ShiftState.InProgress;
        }
        subset.push({
          id: shift.id,
          employee,
          shift: {state, actual: {start: shift.start, end: shift.end}, typical: {start: null, end: typicalEnd}},
          pos: {x: 0, y: 0, w: 0, x1: 0, w1: 0, yi: 0},
          display: {
            center: employee.name.first + ' ' + employee.name.last,
            left: formatTime(shift.start),
            right: formatTime(state === ShiftState.Complete ? shift.end : typicalEnd),
          },
        });
      }
    }
    return {employeeIds: Array.from(employeeIds), shifts: subset};
  }
};

function sortBy(arr) {
  return function (a, b) {
    for (const key of arr) {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
    }
    return 0;
  }
}

Comlink.expose(obj, self as any);
