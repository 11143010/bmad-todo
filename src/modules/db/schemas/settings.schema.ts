import {
  type RxJsonSchema,
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
} from "rxdb";

export const settingsSchemaLiteral = {
  version: 1,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // 'user'
    },
    dailyLimit: {
      type: "number",
      default: 100,
    },
    soundEnabled: {
      type: "boolean",
      default: true,
    },
    hapticsEnabled: {
      type: "boolean",
      default: true,
    },
    fontSize: {
      type: "string",
      enum: ["small", "medium", "large"],
      default: "medium",
    },
  },
  required: ["id", "dailyLimit", "soundEnabled", "hapticsEnabled"],
} as const;

const schemaTyped = toTypedRxJsonSchema(settingsSchemaLiteral);

export type SettingsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const settingsSchema: RxJsonSchema<SettingsDocType> =
  settingsSchemaLiteral;
