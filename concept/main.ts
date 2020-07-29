import { writeJson } from "https://deno.land/std/fs/mod.ts";

import {
  IOperationArea,
  IOperationInstance,
  DatumType,
  OperationType,
  OperationState,
  IComponentInstance,
  ComponentType,
  ICustomer,
  COLORS,
} from "./types.ts";

const operationAreas: IOperationArea[] = [
  ["assembly", [OperationType.Assemble]],
  ["weld", [OperationType.Weld]],
  ["machine", [OperationType.Machine]],
  ["cut", [OperationType.Cut]],
  ["office", [OperationType.Order]],
  ["receiving", [OperationType.Deliver]],
  ["shipping", []],
].map(([id, operationTypes]: any, i) => ({
  id: `operation-area_${id}`,
  name: id[0].toUpperCase() + id.slice(1),
  type: DatumType.OperationArea,
  operationTypes,
  color: COLORS[i],
}));

const stockHead1Order1: IOperationInstance = {
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

const stockHead1Deliver1: IOperationInstance = {
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

const stockHead1: IComponentInstance = {
  id: "stock_head_1",
  type: DatumType.Component,
  name: "Stock Head 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockHead1Order1.id, stockHead1Deliver1.id],
    lastOperation: stockHead1Deliver1.id,
  },
};

const stockBody1Order1: IOperationInstance = {
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

const stockBody1Deliver1: IOperationInstance = {
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

const stockBody1: IComponentInstance = {
  id: "stock_body_1",
  type: DatumType.Component,
  name: "Stock Body 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockBody1Order1.id, stockBody1Deliver1.id],
    lastOperation: stockBody1Deliver1.id,
  },
};

const stockPiston1Order1: IOperationInstance = {
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

const stockPiston1Deliver1: IOperationInstance = {
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

const stockPiston1: IComponentInstance = {
  id: "stock_piston_1",
  type: DatumType.Component,
  name: "Stock Piston 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockPiston1Deliver1.id, stockPiston1Order1.id],
    lastOperation: stockPiston1Deliver1.id,
  },
};

const stockPistonRod1Order1: IOperationInstance = {
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

const stockPistonRod1Deliver1: IOperationInstance = {
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

const stockPistonRod1: IComponentInstance = {
  id: "stock_piston_rod_1",
  type: DatumType.Component,
  name: "Stock Piston Rod 1",
  data: {
    type: ComponentType.Purchased,
    operations: [stockPiston1Deliver1.id, stockPiston1Order1.id],
    lastOperation: stockPiston1Deliver1.id,
  },
};
const cutHead1Gather1: IOperationInstance = {
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
const cutHead1Cut1: IOperationInstance = {
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
const cutHead1: IComponentInstance = {
  id: "cut_head_1",
  type: DatumType.Component,
  name: "Cut Head 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutHead1Gather1.id, cutHead1Cut1.id],
    lastOperation: cutHead1Cut1.id,
  },
};
const cutBody1Gather1: IOperationInstance = {
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
const cutBody1Cut1: IOperationInstance = {
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
const cutBody1: IComponentInstance = {
  id: "cut_body_1",
  type: DatumType.Component,
  name: "Cut Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutBody1Cut1.id],
    lastOperation: cutBody1Cut1.id,
  },
};
const cutPiston1Gather1: IOperationInstance = {
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
const cutPiston1Cut1: IOperationInstance = {
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
const cutPiston1: IComponentInstance = {
  id: "cut_piston_1",
  type: DatumType.Component,
  name: "Cut Piston 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutPiston1Cut1.id, cutPiston1Gather1.id],
    lastOperation: cutPiston1Cut1.id,
  },
};
const cutPistonRod1Gather1: IOperationInstance = {
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
const cutPistonRod1Cut1: IOperationInstance = {
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
const cutPistonRod1: IComponentInstance = {
  id: "cut_piston_rod_1",
  type: DatumType.Component,
  name: "Cut Piston Rod 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [cutPistonRod1Cut1.id, cutPistonRod1Gather1.id],
    lastOperation: cutPistonRod1Cut1.id,
  },
};
const machinedHead1Gather1: IOperationInstance = {
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
const machinedHead1Machine1: IOperationInstance = {
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
const machinedHead1: IComponentInstance = {
  id: "machined_head_1",
  type: DatumType.Component,
  name: "Machined Head 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedHead1Machine1.id, machinedHead1Gather1.id],
    lastOperation: machinedHead1Machine1.id,
  },
};
const machinedBody1Gather1: IOperationInstance = {
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
const machinedBody1Machine1: IOperationInstance = {
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
const machinedBody1: IComponentInstance = {
  id: "machined_body_1",
  type: DatumType.Component,
  name: "Machined Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedBody1Machine1.id, machinedBody1Gather1.id],
    lastOperation: machinedBody1Machine1.id,
  },
};
const sealKit1Order1: IOperationInstance = {
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
const sealKit1Deliver1: IOperationInstance = {
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
const sealKit1: IComponentInstance = {
  id: "seal_kit_1",
  type: DatumType.Component,
  name: "Seal Kit 1",
  data: {
    type: ComponentType.Purchased,
    operations: [sealKit1Order1.id, sealKit1Deliver1.id],
    lastOperation: sealKit1Deliver1.id,
  },
};
const machinedPiston1Gather1: IOperationInstance = {
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
const machinedPiston1Machine1: IOperationInstance = {
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
const machinedPiston1: IComponentInstance = {
  id: "machined_piston_1",
  type: DatumType.Component,
  name: "Machined Piston",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedPiston1Gather1.id, machinedPiston1Machine1.id],
    lastOperation: machinedPiston1Machine1.id,
  },
};
const machinedPistonRod1Gather1: IOperationInstance = {
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
const machinedPistonRod1Machine1: IOperationInstance = {
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
const machinedPistonRod1: IComponentInstance = {
  id: "machined_piston_rod_1",
  type: DatumType.Component,
  name: "Machined Piston Rod",
  data: {
    type: ComponentType.Manufactured,
    operations: [machinedPistonRod1Machine1.id, machinedPistonRod1Gather1.id],
    lastOperation: machinedPistonRod1Machine1.id,
  },
};
const pistonAssembly1Gather1: IOperationInstance = {
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
const pistonAssembly1Assemble1: IOperationInstance = {
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
const pistonAssembly1: IComponentInstance = {
  id: "piston_assembly_1",
  type: DatumType.Component,
  name: "Piston Assembly",
  data: {
    type: ComponentType.Manufactured,
    operations: [pistonAssembly1Gather1.id, pistonAssembly1Assemble1.id],
    lastOperation: pistonAssembly1Assemble1.id,
  },
};
const weldedBody1Gather1: IOperationInstance = {
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
const weldedBody1Weld1: IOperationInstance = {
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
const weldedBody1: IComponentInstance = {
  id: "welded_body_1",
  type: DatumType.Component,
  name: "Welded Body 1",
  data: {
    type: ComponentType.Manufactured,
    operations: [weldedBody1Weld1.id, weldedBody1Gather1.id],
    lastOperation: weldedBody1Weld1.id,
  },
};

const fn = (component: IComponent) => {
  const num = 1;
  const instanceID = [component.id, num].join("_");
  const instanceName = [component.name, num].join(" ");

  let data;
  if (component.operations == null && component.subcomponents == null) {
    data = { type: ComponentType.Purchased };
  } else {
    let lastOperation;
    const operations: IOperationInstance[] = [];
    if (component.operations != null) {
      for (const op of component.operations) {
        const id = [instanceID, op.id].join("-");
        operations.push({
          id,
          type: DatumType.Operation,
          template: op.id,
          description: "",
          data: {
            type: op.type,
            area:
              operationAreas.find((area) =>
                area.operationTypes.includes(op.type)
              )?.id || null,
            state: OperationState.Incomplete,
            prerequisites: [],
          },
        });
      }
    }
    if (component.subcomponents != null) {
      const gather = {
        id: `${component.id}-gather_1`,
        type: DatumType.Operation,
      };
      lastOperation = gather.id;
    }
    data = { type: ComponentType.Manufactured, operations, lastOperation };
  }

  const instance = {
    id: instanceID,
    name: instanceName,
    data,
  };
  return instance;
};

const topAssembly1Gather1: IOperationInstance = {
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

const topAssembly1Assemble1: IOperationInstance = {
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

interface IOperation {
  id: string;
  type: OperationType;
  prerequisites?: string[];
}

interface IComponent {
  id: string;
  name: string;
  operations?: IOperation[];
  subcomponents?: IComponent[];
}

const sealKit: IComponent = {
  id: "seal_kit",
  name: "Seal Kit",
};

const stockPiston = {
  id: "stock_piston",
  name: "Stock Piston",
};

const cutPiston = {
  id: "cut_piston",
  name: "Cut Piston",
  operations: [{ id: "cut_op_1", type: OperationType.Cut }],
  subcomponents: [stockPiston],
};

const machinedPiston = {
  id: "machined_piston",
  name: "Machined Piston",
  operations: [{ id: "machining_op_1", type: OperationType.Machine }],
  subcomponents: [cutPiston],
};

const stockPistonRod: IComponent = {
  id: "stock_piston",
  name: "Stock Piston",
};

const cutPistonRod: IComponent = {
  id: "cut_piston_rod",
  name: "Cut Piston Rod",
  operations: [{ id: "cut_operation_op_1", type: OperationType.Cut }],
  subcomponents: [stockPistonRod],
};

const machinedPistonRod: IComponent = {
  id: "machined_piston_rod",
  name: "Machined Piston Rod",
  operations: [{ id: "machining_op_1", type: OperationType.Machine }],
  subcomponents: [cutPistonRod],
};

const pistonAssembly: IComponent = {
  id: "piston_assembly",
  name: "Piston Assembly",
  operations: [{ id: "assembly_operation_1", type: OperationType.Assemble }],
  subcomponents: [machinedPiston, machinedPistonRod],
};

const stockBody: IComponent = {
  id: "stock_body",
  name: "Stock Body",
};

const cutBody: IComponent = {
  id: "cut_body",
  name: "Cut Body",
  operations: [{ id: "cut_operation_1", type: OperationType.Cut }],
  subcomponents: [stockBody],
};

const machinedBody: IComponent = {
  id: "machined_body",
  name: "Machined Body",
  subcomponents: [cutBody],
};

const cutHead: IComponent = {
  id: "cut_head",
  name: "Cut Head",
  subcomponents: [],
};

const machinedHead: IComponent = {
  id: "machined_head",
  name: "Machined Head",
  operations: [{ id: "machining_op_1", type: OperationType.Machine }],
  subcomponents: [cutHead],
};

const weldedBody: IComponent = {
  id: "welded_body",
  name: "Welded Body",
  operations: [{ id: "welding_op_1", type: OperationType.Weld }],
  subcomponents: [machinedBody, machinedHead],
};

const topAssembly: IComponent = {
  id: "top_assembly",
  name: "Top Assembly",
  subcomponents: [weldedBody, pistonAssembly, sealKit],
};

const topAssembly1: IComponentInstance = {
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

// recurse through templates to determine manufactured/purchased/stock etc
const cylinderAssembly0Template = (() => {
  const id = "cylinder-assembly-0-template";
  return {
    id,
    version: "1",
    operations: [
      {
        id: `${id}_gather-0`,
        type: OperationType.Gather,
        components: [
          { id: `${id}_welded-body-0`, template: "welded-body-0-template" },
          {
            id: `${id}_piston-assembly-0`,
            template: "piston-assembly-0-template",
          },
          { id: `${id}_seal-kit-0` },
        ],
      },
      {
        id: `${id}_assemble-0`,
        type: OperationType.Assemble,
        prerequisites: [`${id}_gather-0`],
        components: [
          { id: `${id}_welded-body-0` },
          { id: `${id}_piston-assembly-0` },
          { id: `${id}_seal-kit-0` },
        ],
      },
    ],
  };
})();

const cylinderAssembly0 = {
  id: "assembly",
  template: cylinderAssembly0Template.id,
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

// await writeJson("./test.json", { test: "toast?" }, { spaces: 2 });

console.log(JSON.stringify(fn(topAssembly), null, 2));
