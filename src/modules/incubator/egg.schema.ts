import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const eggSchemaLiteral = {
  version: 3,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 36,
    },
    status: {
      type: "string",
      enum: ["new", "incubating", "ready", "hatched"],
      default: "new",
    },
    hatchTime: {
      type: "number",
      minimum: 0,
    },
    incubationDuration: {
      type: "number",
      minimum: 0,
      default: 0,
    },
    petId: {
      type: "string",
      maxLength: 36,
    },
    rarity: {
      type: "string",
      enum: [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
        "divine",
      ],
      default: "common",
    },
    createdAt: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["id", "status", "createdAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(eggSchemaLiteral);
export type EggDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const eggSchema: RxJsonSchema<EggDocType> = eggSchemaLiteral;
