export interface IArea {
  id: string;
  name: string;
}

export interface IComponent {
  id: string;
  name: string;
}

export interface IAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

export interface ICustomer {
  id: string;
  name: string;
  address: IAddress;
  phone: string;
  contact: string;
}

export interface IManufacturingOrder {
  component: IComponent;
  customer: ICustomer;
  qty: number;
  shipDate: Date;
  stages: any[];
}

export interface IData {
  areas: IArea[];
  components: IComponent[];
  customers: ICustomer[];
  manufacturingOrders: IManufacturingOrder[];
}

export type CVASig<T> = (arg: T) => void;
