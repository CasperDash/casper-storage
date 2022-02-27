import { IStorage } from "./interfaces";
import { DefaultStorage } from "./providers/default-storage";

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
      StorageManager._storage = new DefaultStorage();
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