import { Password } from "../cryptography/password";
import { IStorage, IStorageConstructable } from "./interfaces";
import { DefaultStorage } from "./providers/default-storage";

/**
 * Provides storage mangement integration
 */
export class StorageManager {

  private static _storageConstructor: IStorageConstructable;

  /**
   * Get an instance of storage manager
   * @returns 
   */
  public static getInstance(password: Password): IStorage {
    let storage: IStorage;
    if (StorageManager._storageConstructor) {
      storage = new StorageManager._storageConstructor(password);
    } else {
      storage = new DefaultStorage(password);
    }

    if (storage && storage.isAvailable()) {
      return storage;
    }

    throw new Error(`No storage is available, please implement one with IStorage and register with StorageManager.register`);
  }

  /**
   * Provides a custom storage
   * @param storage 
   */
  public static register(storage: IStorageConstructable) {
    this._storageConstructor = storage;
  }
}