import { writeJson } from "https://deno.land/std/fs/mod.ts";

import {
  IComponent,
  IComponentInstanceData,
  IOperation,
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

const operationAreas: Array<IOperationArea> = [
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

const sealKit: IComponent = {
  id: "seal_kit",
  name: "Seal Kit",
  operations: [
    { id: "order", type: OperationType.Order },
    { id: "deliver", type: OperationType.Deliver },
  ],
};

const stockPiston: IComponent = {
  id: "stock_piston",
  name: "Stock Piston",
  operations: [
    { id: "order", type: OperationType.Order },
    { id: "deliver", type: OperationType.Deliver },
  ],
};

const cutPiston: IComponent = {
  id: "cut_piston",
  name: "Cut Piston",
  operations: [{ id: "cut_op_1", type: OperationType.Cut }],
  subcomponents: [stockPiston],
};

const machinedPiston: IComponent = {
  id: "machined_piston",
  name: "Machined Piston",
  operations: [{ id: "machining_op_1", type: OperationType.Machine }],
  subcomponents: [cutPiston],
};

const stockPistonRod: IComponent = {
  id: "stock_piston",
  name: "Stock Piston",
  operations: [
    { id: "order", type: OperationType.Order },
    { id: "deliver", type: OperationType.Deliver },
  ],
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
  operations: [
    { id: "order", type: OperationType.Order },
    { id: "deliver", type: OperationType.Deliver },
  ],
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

const gather: IOperation = {
  id: "gather",
  type: OperationType.Gather,
}

function fn(component: IComponent): IComponentInstance {
  const num = 1;
  const instanceID = [component.id, num].join("_");
  const instanceName = [component.name, num].join(" ");

  let data: IComponentInstanceData;
  if (component.operations == null && component.subcomponents == null) {
    data = { type: ComponentType.Purchased };
  } else {
    let lastOperation;
    const operations: IOperationInstance[] = [];
    if (component.operations != null) {
      for (const op of component.operations!) {
        const id = [instanceID, op.id].join("-");
        operations.push({
          id,
          type: DatumType.Operation,
          proto: op,
          template: op.id,
          description: "",
          data: {
            type: op.type,
            area:
              operationAreas.find((a: IOperationArea) =>
                a.operationTypes.includes(op.type)
              )?.id || null,
            state: OperationState.Incomplete,
            prerequisites: [],
          },
        });
      }
    }
    if (component.subcomponents != null) {
      const gatherID = `${component.id}-gather_1`;
      operations.push({
        id: gatherID,
        description: "",
        type: DatumType.Operation,
        proto: gather,
        data: {
          type: OperationType.Gather,
          prerequisites: [],
          area: null,
          state: OperationState.Incomplete,
          components: component.subcomponents.map((c) => fn(c)),
        },
      });
      lastOperation = gatherID;
    }
    data = { type: ComponentType.Manufactured, operations, lastOperation };
  }

  return {
    id: instanceID,
    type: DatumType.Component,
    proto: component,
    name: instanceName,
    data,
  };
}

function flatten(instance: IComponentInstance) {
  const components: Record<string, IComponent> = {};
  const instances: Record<string, IComponentInstance> = {};
  const operations: Record<string, IOperation> = {};

  return { components, instances, operations };
}

await writeJson("./data.json", topAssembly, { spaces: 2 });