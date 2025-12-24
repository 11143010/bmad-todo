import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const petSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 36,
    },
    name: {
      type: "string",
    },
    type: {
      type: "string", // e.g., 'slime', 'dragon'
    },
    rarity: {
      type: "string", // 'common', 'rare', etc.
    },
    image: {
      type: "string", // URL or Asset Path if needed, or derived from type
    },
    createdAt: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["id", "name", "type", "rarity", "createdAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(petSchemaLiteral);
export type PetDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const petSchema: RxJsonSchema<PetDocType> = petSchemaLiteral;
