import * as Comlink from 'comlink';
import { formatTime, addHours, inFieldOfView } from './util';
import { EmployeeID, Employee, Shift, ShiftState } from './models';


declare const DEV: boolean;

let obj;

if (DEV) {
  let data = null;

  obj = {
    async initializeData(date = new Date()) {
      data = require('./mocking').generateData(date);
    },
    async getShiftsInRange([minDate, maxDate]: [Date, Date]): Promise<{shifts: Shift[], employees: {[id: string]: Employee}, employeeIds: EmployeeID[]}> {
      if (data == null) throw new Error('data not initialized');
      const { shifts, employees } = data;
      const filteredShifts: Shift[] = [];
      const filteredEmployees = {};
      const employeeIds = [];
      for (const shift of shifts) {
        if (inFieldOfView([shift.start, shift.end], [minDate, maxDate])) {
          const employeeId = shift.employee.id;
          if (!employeeIds.includes(employeeId)) {
            filteredEmployees[employeeId] = employees[employeeId];
            employeeIds.push(employeeId);
          }
          filteredShifts.push(shift);
        }
      }
      return { shifts: filteredShifts, employees: filteredEmployees, employeeIds };
    },
    async getShiftsByEmployeeInRange(employeeId: EmployeeID, [minDate, maxDate]: [Date, Date]): Promise<{employee: Employee, shifts: Shift[]}> {
      if (data == null) throw new Error('data not initialized');
      const { shifts, employees } = data;
      const employee = employees[employeeId];
      const filteredShifts: Shift[] = [];
      for (const shift of shifts) {
        if (shift.employee.id == employeeId && inFieldOfView([shift.start, shift.end], [minDate, maxDate])) {
          filteredShifts.push(shift);
        }
      }
      return {shifts: filteredShifts, employee};
    },
  };
} else {

}

async function get(key) {
  const res = await fetch(`data/${key}.json`);
  const json = await res.json();
  return json;
}

Object.assign(obj, {
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
  async getEmployees() {
    return Object.values(await obj.data.employees);
  },
  async getEmployeeShifts(ids: number[], [fromDate, toDate]): Promise<{[id: string]: any[]}> {
    const shifts = await obj.data.shifts;
    const subset = ids.reduce((acc, id) => ({...acc, [id]: []}), {});
    for (const shift of shifts) {
      if (ids.includes(shift.employee)) {
        subset[shift.employee].push(shift);
      }
    }
    return subset;
  },
  async getData([fromDate, toDate]) {
    const allShifts = await obj.data.shifts;
    const allEmployees = await obj.data.employees;
    const shifts = [];
    const employees = {};
    const employeeIds = []
    for (const shift of allShifts) {
      if (inFieldOfView([shift.start, shift.end], [fromDate, toDate])) {
        const employeeId = shift.employee;
        const employee = allEmployees[employeeId];
        if (!employeeIds.includes(shift.employee)) {
          employeeIds.push(employeeId);
          employees[employeeId] = employee;
        }
        let state, typicalEnd = null;
        if (shift.end != null) {
          state = ShiftState.Complete;
        } else {
          // made up bs
          typicalEnd = new Date(shift.start);
          typicalEnd.setHours(typicalEnd.getHours() + 8);
          state = ShiftState.Incomplete;
        }
        shifts.push({
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
    return {employeeIds, employees, shifts};
  }
});

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
