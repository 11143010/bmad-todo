import {
  type RxJsonSchema,
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
} from "rxdb";

export const dailyLogSchemaLiteral = {
  version: 2,
  primaryKey: "id", // YYYY-MM-DD
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 10, // 2024-01-01
    },
    date: {
      type: "number", // Timestamp for sorting
    },
    totalPoints: {
      type: "number",
      default: 0,
      minimum: 0,
    },
    tasksCompleted: {
      type: "number",
      default: 0,
      minimum: 0,
    },
    overloadCount: {
      type: "number",
      default: 0,
      minimum: 0,
    },
    records: {
      type: "array",
      items: {
        type: "object",
        properties: {
          taskId: { type: "string" },
          title: { type: "string" },
          points: { type: "number" },
          completedAt: { type: "number" },
          type: { type: "string", enum: ["task", "overload"] },
        },
        required: ["taskId", "title", "points", "completedAt", "type"],
      },
      default: [],
    },
  },
  required: ["id", "date", "totalPoints", "tasksCompleted", "overloadCount"],
} as const;

const schemaTyped = toTypedRxJsonSchema(dailyLogSchemaLiteral);

export type DailyLogDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const dailyLogSchema: RxJsonSchema<DailyLogDocType> =
  dailyLogSchemaLiteral;
