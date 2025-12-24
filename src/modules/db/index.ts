/**
 * @module db
 * @description RxDB database initialization and management for BMad
 */

import {
  createRxDatabase,
  addRxPlugin,
  type RxDatabase,
  type RxCollection,
  type RxStorage,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBMigrationSchemaPlugin } from "rxdb/plugins/migration-schema";
import { taskSchema, type TaskDocType } from "./schemas/task.schema";
import {
  settingsSchema,
  type SettingsDocType,
} from "./schemas/settings.schema";
import {
  dailyLogSchema,
  type DailyLogDocType,
} from "./schemas/daily-log.schema";
import { eggSchema, type EggDocType } from "../incubator/egg.schema";
import { userSchema, type UserDocType } from "./schemas/user.schema";
import { petSchema, type PetDocType } from "@/modules/collection/pet.schema";

// Enable plugins
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

export type BMadDatabaseCollections = {
  tasks: RxCollection<TaskDocType>;
  settings: RxCollection<SettingsDocType>;
  daily_logs: RxCollection<DailyLogDocType>;
  eggs: RxCollection<EggDocType>;
  pets: RxCollection<PetDocType>;
  users: RxCollection<UserDocType>;
};

/** Database type with all collections */
export type BMadDatabase = RxDatabase<BMadDatabaseCollections>;

/** Singleton database promise */
let dbPromise: Promise<BMadDatabase> | null = null;

/** Default daily stress limit */
const DEFAULT_DAILY_LIMIT = 100;

/**
 * Create a new database instance (internal)
 * @returns {Promise<BMadDatabase>} The database instance
 */
const _create = async (): Promise<BMadDatabase> => {
  console.log("DatabaseService: creating database..");

  let storage: RxStorage<unknown, unknown> = getRxStorageDexie();

  if (import.meta.env.DEV) {
    const { wrappedValidateAjvStorage } = await import(
      "rxdb/plugins/validate-ajv"
    );
    storage = wrappedValidateAjvStorage({ storage });
  }

  // Create database instance
  const db = await createRxDatabase<BMadDatabaseCollections>({
    name: "bmaddb",
    storage,
    ignoreDuplicate: import.meta.env.DEV, // Only in dev mode
    multiInstance: false,
  });

  console.log("DatabaseService: created database");

  // Create collections
  await db.addCollections({
    tasks: {
      schema: taskSchema,
      migrationStrategies: {
        // Migration from version 0 to 1: add order field
        1: (oldDoc: Record<string, unknown>) => ({
          ...oldDoc,
          order: 0,
        }),
      },
    },
    settings: {
      schema: settingsSchema,
      migrationStrategies: {
        // Migration from version 0 to 1: add fontSize field
        1: (oldDoc: Record<string, unknown>) => ({
          ...oldDoc,
          fontSize: "medium",
        }),
      },
    },
    daily_logs: {
      schema: dailyLogSchema,
      migrationStrategies: {
        // Migration from version 0 to 1: add records array
        1: (oldDoc: Record<string, unknown>) => ({
          ...oldDoc,
          records: [],
        }),
        // Migration from version 1 to 2: just schema alignment (records are already there)
        2: (oldDoc: Record<string, unknown>) => oldDoc,
      },
    },
    eggs: {
      schema: eggSchema,
      migrationStrategies: {
        1: (oldDoc: Record<string, unknown>) => ({
          ...oldDoc,
          rarity: "common",
        }),
        2: (oldDoc: Record<string, unknown>) => oldDoc,
        3: (oldDoc: Record<string, unknown>) => ({
          ...oldDoc,
          incubationDuration: 0,
        }),
      },
    },
    pets: {
      schema: petSchema,
      migrationStrategies: {},
    },
    users: {
      schema: userSchema,
      migrationStrategies: {},
    },
  });

  // Ensure default settings exist
  const settingsCollection = db.settings;
  const userSettings = await settingsCollection
    .findOne({ selector: { id: "user" } })
    .exec();

  if (!userSettings) {
    await settingsCollection.insert({
      id: "user",
      dailyLimit: DEFAULT_DAILY_LIMIT,
      soundEnabled: true,
      hapticsEnabled: true,
    });
    console.log("DatabaseService: initialized default settings");
  }

  console.log("DatabaseService: collections added");
  return db;
};

/**
 * Initialize the database singleton
 * @returns {Promise<BMadDatabase>} The database instance
 */
export const initDB = (): Promise<BMadDatabase> => {
  if (!dbPromise) {
    dbPromise = _create();
  }
  return dbPromise;
};

/**
 * Get the initialized database instance
 * @returns {Promise<BMadDatabase>} The database instance
 * @throws {Error} If database is not initialized
 */
export const getDB = (): Promise<BMadDatabase> => {
  if (!dbPromise) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return dbPromise;
};
