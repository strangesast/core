import { writeJson } from "https://deno.land/std/fs/mod.ts";

const COLORS = [
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

enum ComponentType {
  Manufactured = "manufactured",
  Purchased = "purchased",
}

enum OperationState {
  Complete = "complete",
  Incomplete = "incomplete",
}

enum OperationType {
  Assemble = "assemble",
  Gather = "gather",
  Cut = "cut",
  Weld = "weld",
  Order = "order",
  Machine = "machine",
  Deliver = "deliver",
  Produce = "produce",
}

enum DatumType {
  Component = "component",
  Customer = "customer",
  Operation = "operation",
  Order = "order",
  OperationArea = "operation-area",
}

interface IDatum {
  id: string;
  type: DatumType;
}

interface IOperationArea extends IDatum {
  id: string;
  type: DatumType.OperationArea;
  name: string;
  color: string;
}

interface IOperationDataBase {
  type: OperationType;
  area: string;
  prerequisites: string[];
  state: OperationState;
  frac?: number;
}

interface IOperationDataGather extends IOperationDataBase {
  type: OperationType.Gather | OperationType.Assemble | OperationType.Weld;
  components: string[];
}

interface IOperationDataGeneric extends IOperationDataBase {}

type IOperationData = IOperationDataGather | IOperationDataGeneric;

interface IOperation extends IDatum {
  id: string;
  type: DatumType.Operation;
  description: string;
  data: IOperationData;
}

interface IComponentData {
  type: ComponentType;
  operations: string[];
  lastOperation: string;
}

interface IComponent extends IDatum {
  id: string;
  type: DatumType.Component;
  name: string;
  data: IComponentData;
}

interface ICustomer extends IDatum {
  id: string;
  type: DatumType.Customer;
  name: string;
}

const operationAreas: IOperationArea[] = [
  "assembly",
  "weld",
  "machine",
  "cut",
  "office",
  "receiving",
  "shipping",
].map((id, i) => ({
  id: `operation-area_${id}`,
  name: id[0].toUpperCase() + id.slice(1),
  type: DatumType.OperationArea,
  color: COLORS[i],
}));

const stockHead1Order1: IOperation = {
  id: "stock_head_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  data: {
    type: OperationType.Order,
    area: "operation-area_office",
    prerequisites: [],
    state: OperationState.Complete,
  },
};

const stockHead1Deliver1: IOperation = {
  id: "stock_head_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  data: {
    type: OperationType.Deliver,
    area: "operation-area_receiving",
    prerequisites: [stockHead1Order1.id],
    state: OperationState.Complete,
  },
};

const stockHead1: IComponent = {
  id: "stock_head_1",
  type: DatumType.Component,
  name: "Stock Head 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockHead1Order1.id, stockHead1Deliver1.id],
    lastOperation: stockHead1Deliver1.id,
  },
};

const stockBody1Order1: IOperation = {
  id: "stock_body_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  data: {
    type: OperationType.Order,
    area: "operation-area_office",
    prerequisites: [],
    state: OperationState.Complete,
  },
};

const stockBody1Deliver1: IOperation = {
  id: "stock_body_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  data: {
    type: OperationType.Deliver,
    area: "operation-area_receiving",
    prerequisites: [stockBody1Order1.id],
    state: OperationState.Complete,
  },
};

const stockBody1: IComponent = {
  id: "stock_body_1",
  type: DatumType.Component,
  name: "Stock Body 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockBody1Order1.id, stockBody1Deliver1.id],
    lastOperation: stockBody1Deliver1.id,
  },
};

const stockPiston1Order1: IOperation = {
  id: "stock_piston_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  data: {
    type: OperationType.Order,
    area: "operation-area_office",
    prerequisites: [],
    state: OperationState.Complete,
  },
};

const stockPiston1Deliver1: IOperation = {
  id: "stock_piston_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  data: {
    type: OperationType.Deliver,
    area: "operation-area_receiving",
    prerequisites: [stockBody1Order1.id],
    state: OperationState.Complete,
  },
};

const stockPiston1: IComponent = {
  id: "stock_piston_1",
  type: DatumType.Component,
  name: "Stock Piston 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockPiston1Deliver1.id, stockPiston1Order1.id],
    lastOperation: stockPiston1Deliver1.id,
  },
};

const stockPistonRod1Order1: IOperation = {
  id: "stock_piston_rod_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  data: {
    type: OperationType.Order,
    area: "operation-area_office",
    prerequisites: [],
    state: OperationState.Complete,
  },
};

const stockPistonRod1Deliver1: IOperation = {
  id: "stock_piston_rod_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  data: {
    type: OperationType.Deliver,
    area: "operation-area_receiving",
    prerequisites: [stockBody1Order1.id],
    state: OperationState.Complete,
  },
};

const stockPistonRod1: IComponent = {
  id: "stock_piston_rod_1",
  type: DatumType.Component,
  name: "Stock Piston Rod 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockPiston1Deliver1.id, stockPiston1Order1.id],
    lastOperation: stockPiston1Deliver1.id,
  },
};
const cutHead1Gather1: IOperation = {
  id: "cut_head_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_cut",
    prerequisites: [],
    state: OperationState.Complete,
    components: [stockHead1.id],
  },
};
const cutHead1Cut1: IOperation = {
  id: "cut_head_1-cut_1",
  type: DatumType.Operation,
  description: "Cut stock material to length",
  data: {
    type: OperationType.Cut,
    state: OperationState.Complete,
    area: "operation-area_cut",
    prerequisites: [cutHead1Gather1.id],
  },
};
const cutHead1: IComponent = {
  id: "cut_head_1",
  type: DatumType.Component,
  name: "Cut Head 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutHead1Gather1.id, cutHead1Cut1.id],
    lastOperation: cutHead1Cut1.id,
  },
};
const cutBody1Gather1: IOperation = {
  id: "cut_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    prerequisites: [],
    area: "operation-area_cut",
    state: OperationState.Complete,
    components: [stockBody1.id],
  },
};
const cutBody1Cut1: IOperation = {
  id: "cut_body_1-cut_1",
  type: DatumType.Operation,
  description: "Cut stock material to length",
  data: {
    type: OperationType.Cut,
    area: "operation-area_cut",
    prerequisites: [cutBody1Gather1.id],
    state: OperationState.Complete,
  },
};
const cutBody1: IComponent = {
  id: "cut_body_1",
  type: DatumType.Component,
  name: "Cut Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutBody1Cut1.id],
    lastOperation: cutBody1Cut1.id,
  },
};
const cutPiston1Gather1: IOperation = {
  id: "cut_piston_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_cut",
    state: OperationState.Complete,
    prerequisites: [],
    components: [stockPiston1.id],
  },
};
const cutPiston1Cut1: IOperation = {
  id: "cut_piston_1-cut_1",
  type: DatumType.Operation,
  description: "Cut material",
  data: {
    type: OperationType.Cut,
    area: "operation-area_cut",
    state: OperationState.Complete,
    prerequisites: [cutPiston1Gather1.id],
  },
};
const cutPiston1: IComponent = {
  id: "cut_piston_1",
  type: DatumType.Component,
  name: "Cut Piston 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutPiston1Cut1.id, cutPiston1Gather1.id],
    lastOperation: cutPiston1Cut1.id,
  },
};
const cutPistonRod1Gather1: IOperation = {
  id: "cut_piston_rod_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    prerequisites: [],
    type: OperationType.Gather,
    area: "operation-area_cut",
    state: OperationState.Complete,
    components: [stockPistonRod1.id],
  },
};
const cutPistonRod1Cut1: IOperation = {
  id: "cut_piston_rod_1-cut_1",
  type: DatumType.Operation,
  description: "Cut material",
  data: {
    type: OperationType.Cut,
    prerequisites: [cutPistonRod1Gather1.id],
    area: "operation-area_cut",
    state: OperationState.Complete,
  },
};
const cutPistonRod1: IComponent = {
  id: "cut_piston_rod_1",
  type: DatumType.Component,
  name: "Cut Piston Rod 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutPistonRod1Cut1.id, cutPistonRod1Gather1.id],
    lastOperation: cutPistonRod1Cut1.id,
  },
};
const machinedHead1Gather1: IOperation = {
  id: "machined_head_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    prerequisites: [],
    area: "operation-area_machine",
    state: OperationState.Complete,
    components: [cutHead1.id],
  },
};
const machinedHead1Machine1: IOperation = {
  id: "machined_head_1-machine_1",
  type: DatumType.Operation,
  description: "Machine stock head",
  data: {
    type: OperationType.Machine,
    area: "operation-area_machine",
    prerequisites: [machinedHead1Gather1.id],
    state: OperationState.Incomplete,
    frac: 60,
  },
};
const machinedHead1: IComponent = {
  id: "machined_head_1",
  type: DatumType.Component,
  name: "Machined Head 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedHead1Machine1.id, machinedHead1Gather1.id],
    lastOperation: machinedHead1Machine1.id,
  },
};
const machinedBody1Gather1: IOperation = {
  id: "machined_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_machine",
    prerequisites: [],
    state: OperationState.Complete,
    components: [cutBody1.id],
  },
};
const machinedBody1Machine1: IOperation = {
  id: "machined_body_1-machine_1",
  type: DatumType.Operation,
  description: "Machine stock body",
  data: {
    type: OperationType.Machine,
    area: "operation-area_machine",
    prerequisites: [machinedBody1Gather1.id],
    state: OperationState.Complete,
  },
};
const machinedBody1: IComponent = {
  id: "machined_body_1",
  type: DatumType.Component,
  name: "Machined Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedBody1Machine1.id, machinedBody1Gather1.id],
    lastOperation: machinedBody1Machine1.id,
  },
};
const sealKit1Order1: IOperation = {
  id: "seal_kit_1-order_1",
  type: DatumType.Operation,
  description: "Order item",
  data: {
    prerequisites: [],
    type: OperationType.Order,
    area: "operation-area_office",
    state: OperationState.Complete,
  },
};
const sealKit1Deliver1: IOperation = {
  id: "seal_kit_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver item",
  data: {
    type: OperationType.Deliver,
    prerequisites: [sealKit1Order1.id],
    area: "operation-area_receiving",
    state: OperationState.Complete,
  },
};
const sealKit1: IComponent = {
  id: "seal_kit_1",
  type: DatumType.Component,
  name: "Seal Kit 1",
  data: {
    type: ComponentType.Purchased,
    operations: [sealKit1Order1.id, sealKit1Deliver1.id],
    lastOperation: sealKit1Deliver1.id,
  },
};
const machinedPiston1Gather1: IOperation = {
  id: "machined_piston_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_machine",
    prerequisites: [],
    state: OperationState.Complete,
    components: [cutPiston1.id],
  },
};
const machinedPiston1Machine1: IOperation = {
  id: "machined_piston_1-machine_1",
  type: DatumType.Operation,
  description: "Machine piston",
  data: {
    type: OperationType.Machine,
    area: "operation-area_machine",
    state: OperationState.Complete,
    prerequisites: [machinedPiston1Gather1.id],
  },
};
const machinedPiston1: IComponent = {
  id: "machined_piston_1",
  type: DatumType.Component,
  name: "Machined Piston",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedPiston1Gather1.id, machinedPiston1Machine1.id],
    lastOperation: machinedPiston1Machine1.id,
  },
};
const machinedPistonRod1Gather1: IOperation = {
  id: "machined_piston_rod_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_machine",
    prerequisites: [],
    state: OperationState.Complete,
    components: [cutPistonRod1.id],
  },
};
const machinedPistonRod1Machine1: IOperation = {
  id: "machined_piston_rod_1-machine_1",
  type: DatumType.Operation,
  description: "Machine piston rod",
  data: {
    type: OperationType.Machine,
    area: "operation-area_machine",
    state: OperationState.Complete,
    prerequisites: [machinedPistonRod1Gather1.id],
  },
};
const machinedPistonRod1: IComponent = {
  id: "machined_piston_rod_1",
  type: DatumType.Component,
  name: "Machined Piston Rod",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedPistonRod1Machine1.id, machinedPistonRod1Gather1.id],
    lastOperation: machinedPistonRod1Machine1.id,
  },
};
const pistonAssembly1Gather1: IOperation = {
  id: "piston_assembly_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  data: {
    type: OperationType.Gather,
    area: "operation-area_assembly",
    state: OperationState.Incomplete,
    prerequisites: [],
    components: [machinedPiston1.id, machinedPistonRod1.id],
  },
};
const pistonAssembly1Assemble1: IOperation = {
  id: "piston_assembly_1-assemble_1",
  type: DatumType.Operation,
  description: "Assemble subcomponents",
  data: {
    type: OperationType.Assemble,
    area: "operation-area_assembly",
    state: OperationState.Incomplete,
    prerequisites: [pistonAssembly1Gather1.id],
    components: [machinedPiston1.id, machinedPistonRod1.id],
  },
};
const pistonAssembly1: IComponent = {
  id: "piston_assembly_1",
  type: DatumType.Component,
  name: "Piston Assembly",
  data: {
    type: ComponentType.Manufactured,
    operations: [pistonAssembly1Gather1.id, pistonAssembly1Assemble1.id],
    lastOperation: pistonAssembly1Assemble1.id,
  },
};
const weldedBody1Gather1: IOperation = {
  id: "welded_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather components",
  data: {
    type: OperationType.Gather,
    area: "operation-area_weld",
    state: OperationState.Incomplete,
    prerequisites: [],
    components: [machinedBody1.id, machinedHead1.id],
  },
};
const weldedBody1Weld1: IOperation = {
  id: "welded_body_1-weld_1",
  type: DatumType.Operation,
  description: "Weld subcomponents",
  data: {
    type: OperationType.Weld,
    area: "operation-area_weld",
    state: OperationState.Incomplete,
    prerequisites: [weldedBody1Gather1.id],
    components: [machinedBody1.id, machinedHead1.id],
  },
};
const weldedBody1: IComponent = {
  id: "welded_body_1",
  type: DatumType.Component,
  name: "Welded Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [weldedBody1Weld1.id, weldedBody1Gather1.id],
    lastOperation: weldedBody1Weld1.id,
  },
};
const topAssembly1Gather1: IOperation = {
  id: "top_assembly_1-gather_1",
  type: DatumType.Operation,
  description: "Gather subcomponents",
  data: {
    type: OperationType.Gather,
    area: "operation-area_assembly",
    state: OperationState.Incomplete,
    prerequisites: [],
    components: [weldedBody1.id, pistonAssembly1.id, sealKit1.id],
  },
};

const topAssembly1Assemble1: IOperation = {
  id: "top_assembly_1-assemble_1",
  type: DatumType.Operation,
  description: "Assemble cylinder with proper fit and seals.",
  data: {
    type: OperationType.Assemble,
    area: "operation-area_assembly",
    state: OperationState.Incomplete,
    prerequisites: [topAssembly1Gather1.id],
  },
};

const topAssembly1: IComponent = {
  id: "top_assembly_1",
  type: DatumType.Component,
  name: "Top Assembly 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [topAssembly1Gather1.id, topAssembly1Assemble1.id],
    lastOperation: topAssembly1Assemble1.id,
  },
};

const customer1: ICustomer = {
  id: "customer_1",
  type: DatumType.Customer,
  name: "Customer 1",
};

const produceAssembly1 = {
  id: "produce1",
  type: DatumType.Operation,
  description: "Produce cylinder",
  data: {
    type: OperationType.Produce,
    area: "operation-area_shipping",
    prerequisites: [],
    state: OperationState.Incomplete,
    name: "20 Cylinders",
    customer: customer1,
    components: [topAssembly1],
  },
};

writeJson("./test.json", { test: "toast?" }, { spaces: 2 });
