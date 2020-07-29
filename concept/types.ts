export const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export enum ComponentType {
  Manufactured = "manufactured",
  Purchased = "purchased",
}

export enum OperationState {
  Complete = "complete",
  Incomplete = "incomplete",
}

export enum OperationType {
  Assemble = "assemble",
  Gather = "gather",
  Cut = "cut",
  Weld = "weld",
  Order = "order",
  Machine = "machine",
  Deliver = "deliver",
  Produce = "produce",
}

export enum DatumType {
  Component = "component",
  Customer = "customer",
  Operation = "operation",
  Order = "order",
  OperationArea = "operation-area",
}

export interface IDatum {
  id: string;
  type: DatumType;
}

export interface IOperationArea extends IDatum {
  id: string;
  type: DatumType.OperationArea;
  operationTypes: OperationType[],
  name: string;
  color: string;
}

export interface IOperationDataBase {
  type: OperationType;
  area: string | null;
  prerequisites: string[];
  state: OperationState;
  frac?: number;
}

export interface IOperationDataGather extends IOperationDataBase {
  type: OperationType.Gather | OperationType.Assemble | OperationType.Weld;
  components: string[];
}

export interface IOperationDataGeneric extends IOperationDataBase {}

export type IOperationData = IOperationDataGather | IOperationDataGeneric;

export interface IOperationInstance extends IDatum {
  id: string;
  type: DatumType.Operation;
  template?: string;
  description: string;
  data: IOperationData;
}

export interface IComponentData {
  type: ComponentType;
  operations: string[];
  lastOperation: string;
}

export interface IComponentInstance extends IDatum {
  id: string;
  type: DatumType.Component;
  name: string;
  data: IComponentData;
}

export interface ICustomer extends IDatum {
  id: string;
  type: DatumType.Customer;
  name: string;
}