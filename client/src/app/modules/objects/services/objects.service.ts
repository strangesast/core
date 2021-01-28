import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { pluck, map, multicast, refCount } from 'rxjs/operators';
import { IData } from '../models';

const pluckArrayValue = map((arr: any[]) =>
  arr ? arr.map((v) => v.value) : []
);

const getArr = (source: Observable<IData>, prop: string) =>
  source.pipe(
    pluck(prop),
    pluckArrayValue,
    multicast(new BehaviorSubject([])),
    refCount()
  );

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  data$ = new BehaviorSubject<IData>({
    areas: [],
    components: [],
    customers: [],
    manufacturingOrders: [],
  });

  areas$ = getArr(this.data$, 'areas');
  components$ = getArr(this.data$, 'components');
  customers$ = getArr(this.data$, 'customers');
  manufacturingOrders$ = getArr(this.data$, 'manufacturingOrders');

  constructor() {}
}
