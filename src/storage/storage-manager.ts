import { IStorage } from "./interfaces";
import { LocalStorage } from "./providers/local-storage";
import { AsyncStorage } from "./providers/async-storage";

/**
 * Provides storage mangement integration
 */
export class StorageManager {
  private static _storage: IStorage;

  /**
   * Get an instance of storage manager
   * @returns 
   */
  public static getInstance(): IStorage {
    if (!StorageManager._storage) {
      let storage: IStorage = new AsyncStorage();
      if (storage.isAvailable()) {
        StorageManager._storage = storage;
        return storage;
      }

      storage = new LocalStorage();
      if(storage.isAvailable()) {
        StorageManager._storage = storage;
        return storage;
      }

      throw new Error(`No storage is available, please implement one with IStorage and register with StorageManager.register.
Or if you're using react-native, @react-native-async-storage/async-storage should be installed`);
    }
    return StorageManager._storage;
  }

  /**
   * Provides a custom storage manager
   * @param storage 
   */
  public static register(storage: IStorage) {
    this._storage = storage;
  }
}