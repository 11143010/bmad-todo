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

export type BMadDatabase = RxDatabase<BMadDatabaseCollections>;

let dbPromise: Promise<BMadDatabase> | null = null;

const _create = async (): Promise<BMadDatabase> => {
  console.log("DatabaseService: creating database..");

  let storage: RxStorage<any, any> = getRxStorageDexie();

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
    ignoreDuplicate: true, // Helpful for HMR
    multiInstance: false, // Disable multi-instance to avoid conflicts
  });

  console.log("DatabaseService: created database");

  // Create collections
  await db.addCollections({
    tasks: {
      schema: taskSchema,
    },
    settings: {
      schema: settingsSchema,
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
      dailyLimit: 100,
      soundEnabled: true,
      hapticsEnabled: true,
    });
    console.log("DatabaseService: initialized default settings");
  }

  console.log("DatabaseService: collections added");
  return db;
};

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = _create();
  }
  return dbPromise;
};

export const getDB = () => {
  if (!dbPromise) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return dbPromise;
};
