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
  Operation = "operation",
  Order = "order",
  OperationArea = "operation-area",
}

interface Datum {
  id: string;
  type: DatumType;
}

interface OperationArea extends Datum {
  id: string;
  type: DatumType.OperationArea;
  name: string;
  color: string;
}

const operationAreas: OperationArea[] = [
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

const assembly = {
  component: {
    id: "assembly",
    name: "Assembly",
    subcomponents: [
      {
        id: "welded_body",
        name: "Welded Body",
        subcomponents: [
          
        ],
      },
    ],
  },
};

const stockHead1Order1 = {
  id: "stock_head_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  operationType: OperationType.Order,
  operationArea: "operation-area_office",
  operationPrerequisites: [],
  operationState: OperationState.Complete,
};
const stockHead1Deliver1 = {
  id: "stock_head_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  operationType: OperationType.Deliver,
  operationArea: "operation-area_receiving",
  operationPrerequisites: [stockHead1Order1],
  operationState: OperationState.Complete,
};
const stockHead1 = {
  id: "stock_head_1",
  type: DatumType.Component,
  name: "Stock Head 1",
  componentType: ComponentType.Purchased,
  operations: [stockHead1Order1, stockHead1Deliver1],
  lastOperation: stockHead1Deliver1,
};
const stockBody1Order1 = {
  id: "stock_body_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  operationType: OperationType.Order,
  operationArea: "operation-area_office",
  operationPrerequisites: [],
  operationState: OperationState.Complete,
};
const stockBody1Deliver1 = {
  id: "stock_body_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  operationType: OperationType.Deliver,
  operationArea: operationAreaReceiving,
  operationPrerequisites: [stockBody1Order1],
  operationState: OperationState.Complete,
};
const stockBody1 = {
  id: "stock_body_1",
  type: DatumType.Component,
  name: "Stock Body 1",
  componentType: ComponentType.PURCHASED,
  operations: [stockBody1Order1, stockBody1Deliver1],
  lastOperation: stockBody1Deliver1,
};
const stockPiston1Order1 = {
  id: "stock_piston_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  operationType: OperationType.ORDER,
  operationArea: operationAreaOffice,
  operationPrerequisites: [],
  operationState: OperationState.Complete,
};
const stockPiston1Deliver1 = {
  id: "stock_piston_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  operationType: OperationType.Deliver,
  operationArea: operationAreaReceiving,
  operationPrerequisites: [stockBody1Order1],
  operationState: OperationState.Complete,
};
const stockPiston1 = {
  id: "stock_piston_1",
  type: DatumType.Component,
  name: "Stock Piston 1",
  componentType: ComponentType.Purchased,
  operations: [stockPiston1Deliver1, stockPiston1Order1],
  lastOperation: stockPiston1Deliver1,
};
const stockPistonRod1Order1 = {
  id: "stock_piston_rod_1-order_1",
  type: DatumType.Operation,
  description: "Order material",
  operationType: OperationType.Order,
  operationArea: operationAreaOffice,
  operationPrerequisites: [],
  operationState: OperationState.Complete,
};
const stockPistonRod1Deliver1 = {
  id: "stock_piston_rod_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver material",
  operationType: OperationType.Deliver,
  operationArea: operationAreaReceiving,
  operationPrerequisites: [stockBody1Order1],
  operationState: OperationState.Complete,
};
const stockPistonRod1 = {
  id: "stock_piston_rod_1",
  type: DatumType.Component,
  name: "Stock Piston Rod 1",
  componentType: ComponentType.Purchased,
  operations: [stockPiston1Deliver1, stockPiston1Order1],
  lastOperation: stockPiston1Deliver1,
};
const cutHead1Gather1 = {
  id: "cut_head_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaCut,
  operationPrerequisites: [],
  operationState: OperationState.Complete,
  data: {
    components: [stockHead1],
  },
};
const cutHead1Cut1 = {
  id: "cut_head_1-cut_1",
  type: DatumType.Operation,
  description: "Cut stock material to length",
  operationType: OperationType.Cut,
  operationState: OperationState.Complete,
  operationArea: operationAreaCut,
  operationPrerequisites: [cutHead1Gather1],
};
const cutHead1 = {
  id: "cut_head_1",
  type: DatumType.Component,
  name: "Cut Head 1",
  componentType: ComponentType.Manufactured,
  operations: [cutHead1Gather1, cutHead1Cut1],
  lastOperation: cutHead1Cut1,
};
const cutBody1Gather1 = {
  id: "cut_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationPrerequisites: [],
  operationArea: operationAreaCut,
  operationState: OperationState.Complete,
  data: {
    components: [stockBody1],
  },
};
const cutBody1Cut1 = {
  id: "cut_body_1-cut_1",
  type: DatumType.Operation,
  description: "Cut stock material to length",
  operationType: OperationType.Cut,
  operationArea: operationAreaCut,
  operationPrerequisites: [cutBody1Gather1],
  operationState: OperationState.Complete,
};
const cutBody1 = {
  id: "cut_body_1",
  type: DatumType.Component,
  name: "Cut Body 1",
  componentType: ComponentType.Manufactured,
  operations: [cutBody1Cut1],
  lastOperation: cutBody1Cut1,
};
const cutPiston1Gather1 = {
  id: "cut_piston_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaCut,
  operationState: OperationState.Complete,
  operationPrerequisites: [],
  data: {
    components: [stockPiston1],
  },
};
const cutPiston1Cut1 = {
  id: "cut_piston_1-cut_1",
  type: DatumType.Operation,
  description: "Cut material",
  operationType: OperationType.Cut,
  operationArea: operationAreaCut,
  operationState: OperationState.Complete,
  operationPrerequisites: [cutPiston1Gather1],
};
const cutPiston1 = {
  id: "cut_piston_1",
  type: DatumType.Component,
  name: "Cut Piston 1",
  componentType: ComponentType.Manufactured,
  operations: [cutPiston1Cut1, cutPiston1Gather1],
  lastOperation: cutPiston1Cut1,
};
const cutPistonRod1Gather1 = {
  id: "cut_piston_rod_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationPrerequisites: [],
  operationType: OperationType.Gather,
  operationArea: operationAreaCut,
  operationState: OperationState.Complete,
  data: {
    components: [stockPistonRod1],
  },
};
const cutPistonRod1Cut1 = {
  id: "cut_piston_rod_1-cut_1",
  type: DatumType.Operation,
  description: "Cut material",
  operationPrerequisites: [cutPistonRod1Gather1],
  operationType: OperationType.Cut,
  operationArea: operationAreaCut,
  operationState: OperationState.Complete,
};
const cutPistonRod1 = {
  id: "cut_piston_rod_1",
  type: DatumType.Component,
  name: "Cut Piston Rod 1",
  componentType: ComponentType.Manufactured,
  operations: [cutPistonRod1Cut1, cutPistonRod1Gather1],
  lastOperation: cutPistonRod1Cut1,
};
const machinedHead1Gather1 = {
  id: "machined_head_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationPrerequisites: [],
  operationArea: operationAreaMachine,
  operationState: OperationState.Complete,
  data: {
    components: [cutHead1],
  },
};
const machinedHead1Machine1 = {
  id: "machined_head_1-machine_1",
  type: DatumType.Operation,
  description: "Machine stock head",
  operationType: OperationType.Machine,
  operationArea: operationAreaMachine,
  operationPrerequisites: [machinedHead1Gather1],
  operationState: OperationState.Incomplete,
  operationFrac: 60,
};
const machinedHead1 = {
  id: "machined_head_1",
  type: DatumType.Component,
  name: "Machined Head 1",
  componentType: ComponentType,
  operations: [machinedHead1Machine1, machinedHead1Gather1],
  lastOperation: machinedHead1Machine1,
};
const machinedBody1Gather1 = {
  id: "machined_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaMachine,
  operationPrerequisites: [],
  operationState: "complete",
  data: {
    components: [cutBody1],
  },
};
const machinedBody1Machine1 = {
  id: "machined_body_1-machine_1",
  type: DatumType.Operation,
  description: "Machine stock body",
  operationType: OperationType.Machine,
  operationArea: operationAreaMachine,
  operationPrerequisites: [machinedBody1Gather1],
  operationState: "complete",
};
const machinedBody1 = {
  id: "machined_body_1",
  type: DatumType.Component,
  name: "Machined Body 1",
  componentType: ComponentType,
  operations: [machinedBody1Machine1, machinedBody1Gather1],
  lastOperation: machinedBody1Machine1,
};
const sealKit1Order1 = {
  id: "seal_kit_1-order_1",
  type: DatumType.Operation,
  description: "Order item",
  operationPrerequisites: [],
  operationType: OperationType.Order,
  operationArea: operationAreaOffice,
  operationState: OperationState.Complete,
};
const sealKit1Deliver1 = {
  id: "seal_kit_1-deliver_1",
  type: DatumType.Operation,
  description: "Deliver item",
  operationPrerequisites: [sealKit1Order1],
  operationType: OperationType.Deliver,
  operationArea: operationAreaReceiving,
  operationState: OperationState.Complete,
};
const sealKit1 = {
  id: "seal_kit_1",
  type: DatumType.Component,
  name: "Seal Kit 1",
  operations: [sealKit1Order1, sealKit1Deliver1],
  lastOperation: sealKit1Deliver1,
  componentType: ComponentType.Purchased,
};
const machinedPiston1Gather1 = {
  id: "machined_piston_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaMachine,
  operationPrerequisites: [],
  operationState: OperationState.Complete,
  data: {
    components: [cutPiston1],
  },
};
const machinedPiston1Machine1 = {
  id: "machined_piston_1-machine_1",
  type: DatumType.Operation,
  description: "Machine piston",
  operationType: OperationType.Machine,
  operationArea: operationAreaMachine,
  operationState: OperationState.Complete,
  operationPrerequisites: [machinedPiston1Gather1],
};
const machinedPiston1 = {
  id: "machined_piston_1",
  type: DatumType.Component,
  name: "Machined Piston",
  operations: [machinedPiston1Gather1, machinedPiston1Machine1],
  lastOperation: machinedPiston1Machine1,
  componentType: ComponentType.Manufactured,
};
const machinedPistonRod1Gather1 = {
  id: "machined_piston_rod_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaMachine,
  operationPrerequisites: [],
  operationState: OperationState.Complete,
  data: {
    components: [cutPistonRod1],
  },
};
const machinedPistonRod1Machine1 = {
  id: "machined_piston_rod_1-machine_1",
  type: DatumType.Operation,
  description: "Machine piston rod",
  operationType: OperationType.Machine,
  operationArea: operationAreaMachine,
  operationState: OperationState.Complete,
  operationPrerequisites: [machinedPistonRod1Gather1],
};
const machinedPistonRod1 = {
  id: "machined_piston_rod_1",
  type: DatumType.Component,
  name: "Machined Piston Rod",
  operations: [machinedPistonRod1Machine1, machinedPistonRod1Gather1],
  lastOperation: machinedPistonRod1Machine1,
  componentType: ComponentType.Manufactured,
};
const pistonAssembly1Gather1 = {
  id: "piston_assembly_1-gather_1",
  type: DatumType.Operation,
  description: "Gather material",
  operationType: OperationType.Gather,
  operationArea: operationAreaAssembly,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [],
  data: {
    components: [machinedPiston1, machinedPistonRod1],
  },
};
const pistonAssembly1Assemble1 = {
  id: "piston_assembly_1-assemble_1",
  type: DatumType.Operation,
  description: "Assemble subcomponents",
  operationType: OperationType.Assemble,
  operationArea: operationAreaAssembly,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [pistonAssembly1Gather1],
  data: {
    components: [machinedPiston1, machinedPistonRod1],
  },
};
const pistonAssembly1 = {
  id: "piston_assembly_1",
  type: DatumType.Component,
  name: "Piston Assembly",
  operations: [pistonAssembly1Gather1, pistonAssembly1Assemble1],
  lastOperation: pistonAssembly1Assemble1,
  componentType: ComponentType.Manufactured,
};
const weldedBody1Gather1 = {
  id: "welded_body_1-gather_1",
  type: DatumType.Operation,
  description: "Gather components",
  operationType: OperationType.Gather,
  operationArea: operationAreaWeld,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [],
  data: {
    components: [machinedBody1, machinedHead1],
  },
};
const weldedBody1Weld1 = {
  id: "welded_body_1-weld_1",
  type: DatumType.Operation,
  description: "Weld subcomponents",
  operationType: OperationType.Weld,
  operationArea: operationAreaWeld,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [weldedBody1Gather1],
  data: {
    components: [machinedBody1, machinedHead1],
  },
};
const weldedBody1 = {
  id: "welded_body_1",
  type: DatumType.Component,
  name: "Welded Body 1",
  operations: [weldedBody1Weld1, weldedBody1Gather1],
  lastOperation: weldedBody1Weld1,
  componentType: ComponentType.Manufactured,
};
const topAssembly1Gather1 = {
  id: "top_assembly_1-gather_1",
  type: DatumType.Operation,
  description: "Gather subcomponents",
  operationType: OperationType.Gather,
  operationArea: operationAreaAssembly,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [],
  data: {
    components: [weldedBody1, pistonAssembly1, sealKit1],
  },
};
const topAssembly1Assemble1 = {
  id: "top_assembly_1-assemble_1",
  type: DatumType.Operation,
  description: "Assemble cylinder with proper fit and seals.",
  operationType: OperationType.Assemble,
  operationArea: operationAreaAssembly,
  operationState: OperationState.Incomplete,
  operationPrerequisites: [topAssembly1Gather1],
};
const topAssembly1 = {
  id: "top_assembly_1",
  type: DatumType.Component,
  name: "Top Assembly 1",
  operations: [topAssembly1Gather1, topAssembly1Assemble1],
  lastOperation: topAssembly1Assemble1,
  componentType: ComponentType.Manufactured,
};
const customer1 = {
  id: "customer_1",
  name: "Customer 1",
};

const produceAssembly1 = {
  id: "produce1",
  type: DatumType.Operation,
  description: "Produce cylinder",
  operationType: OperationType.Produce,
  operationArea: operationAreaShipping,
  operationPrerequisites: [],
  operationState: OperationState.Incomplete,
  data: {
    name: "20 Cylinders",
    customer: customer1,
    components: [topAssembly1],
  },
};

writeJson("./test.json", { test: "toast?" }, { spaces: 2 });
