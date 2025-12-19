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
import { taskSchema, type TaskDocType } from "./schemas/task.schema";
import {
  settingsSchema,
  type SettingsDocType,
} from "./schemas/settings.schema";
import {
  dailyLogSchema,
  type DailyLogDocType,
} from "./schemas/daily-log.schema";

// Enable dev mode for better error messages in development
addRxPlugin(RxDBUpdatePlugin);
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

export type BMadDatabaseCollections = {
  tasks: RxCollection<TaskDocType>;
  settings: RxCollection<SettingsDocType>;
  daily_logs: RxCollection<DailyLogDocType>;
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
