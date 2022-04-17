import { IStorage } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let storage: any;
try {
  // Only try to require the package
  // If no storages are available we will throw error and asking for one on runtime
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default;
}
catch (error) {
  // Igore
}

/**
 * Default storage, which is a wrapper of AsyncStorage
 * Supports Web, iOS, Android, etc
 */
export class AsyncStorage implements IStorage {

  async set(key: string, value: string): Promise<void> {
    await storage.setItem(key, value);
  }

  async get(key: string): Promise<string> {
    return await storage.getItem(key);
  }

  async has(key: string): Promise<boolean> {
    const keys = await storage.getAllKeys();
    return keys && keys.indexOf(key) >= 0;
  }

  async remove(key: string): Promise<void> {
    await storage.removeItem(key);
  }

  async clear(): Promise<void> {
    await storage.clear();
  }

  public isAvailable(): boolean {
    return !!storage;
  }
}
