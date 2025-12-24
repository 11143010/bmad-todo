import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const userSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // 'player'
    },
    energy: {
      type: "number",
      default: 0,
      minimum: 0,
    },
    level: {
      type: "number",
      default: 1,
      minimum: 1,
    },
    xp: {
      type: "number",
      default: 0,
      minimum: 0,
    },
    // Future expansion: activePet, title, etc.
  },
  required: ["id", "energy", "level", "xp"],
} as const;

const schemaTyped = toTypedRxJsonSchema(userSchemaLiteral);

export type UserDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const userSchema: RxJsonSchema<UserDocType> = userSchemaLiteral;
