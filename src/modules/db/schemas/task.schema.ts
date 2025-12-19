import {
  type RxJsonSchema,
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
} from "rxdb";

export const taskSchemaLiteral = {
  version: 1,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    title: {
      type: "string",
    },
    status: {
      type: "string",
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    points: {
      type: "number",
      minimum: 0,
    },
    createdAt: {
      type: "number",
    },
    order: {
      type: "number",
      default: 0,
    },
  },
  required: ["id", "title", "status", "points", "createdAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(taskSchemaLiteral);

export type TaskDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const taskSchema: RxJsonSchema<TaskDocType> = taskSchemaLiteral;
