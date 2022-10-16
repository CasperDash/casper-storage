import { PasswordOptions } from "../cryptography/password-options";
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
  public static getInstance(pwdOptions: PasswordOptions, throwErrorIfNotAvailable = true): IStorage {
    let storage: IStorage;
    if (StorageManager._storageConstructor) {
      storage = new StorageManager._storageConstructor(pwdOptions);
    } else {
      storage = new DefaultStorage(pwdOptions);
    }

    if (storage && storage.isAvailable()) {
      return storage;
    }

    if (throwErrorIfNotAvailable) {
      throw new Error(`No storage is available, please implement one with IStorage and register with StorageManager.register`);
    }
  }

  /**
   * Provides a custom storage
   * @param storage 
   */
  public static register(storage: IStorageConstructable) {
    this._storageConstructor = storage;
  }
}