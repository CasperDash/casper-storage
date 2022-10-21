import { AESUtils, EncryptionResult } from "../../cryptography";
import { TypeUtils } from "../../utils";
import { IStorage } from "../interfaces";

const ENCRYPTED_PREFIX = "cps_encrypted_";

/**
 * Simple wrapper for localStorage of browser
 */
export class DefaultStorage implements IStorage {

  constructor(private _password: string) {
    if (!this._password) {
      throw new Error("Password is required");
    }
  }

  public async set(key: string, value: string, password?: string): Promise<void> {
    const encryptedValue = await this.encrypt(value, password);
    return this.getStorage().setItem(key, ENCRYPTED_PREFIX + encryptedValue.toString());
  }

  public async get(key: string, password?: string): Promise<string> {
    const value = this.getStorage().getItem(key);
    if (TypeUtils.isString(value) && value.startsWith(ENCRYPTED_PREFIX)) {
      return this.decrypt(value.substring(ENCRYPTED_PREFIX.length), password);
    } else {
      return value;
    }
  }

  public async has(key: string): Promise<boolean> {
    return this.getStorage().getItem(key) != null;
  }

  public async remove(key: string): Promise<void> {
    return this.getStorage().removeItem(key);
  }

  public async clear(): Promise<void> {
    return this.getStorage().clear();
  }

  public async updatePassword(newPassword: string): Promise<void> {
    // Resync all existing keys
    const keys = await this.getKeys();

    if (keys && keys.length) {
      // Get the existing item with previous password
      const tempValues = {};
      for (const key of keys) {
        const value = await this.get(key);
        tempValues[key] = value;
      }

      // And set back with the new password
      for (const key in tempValues) {
        await this.set(key, tempValues[key], newPassword);
      }
    }

    // Update the new password to encrypt/decrypt values
    this._password = newPassword;
  }

  public getKeys(): Promise<string[]> {
    const keys = [];
    for (const [key, value] of Object.entries(this.getStorage())) {
      if (TypeUtils.isString(value) && value.startsWith(ENCRYPTED_PREFIX)) {
        keys.push(key);
      }
    }
    return Promise.resolve(keys);
  }

  public isAvailable(): boolean {
    try {
      this.getStorage().getItem("__test__");
      return true;
    } catch (_) {
      return false;
    }
  }

  protected getStorage() {
    return localStorage;
  }

  private async encrypt(value: string, password?: string) {
    password = password || this._password;
    const encryptionValue = await AESUtils.encrypt(password, value);
    return encryptionValue;
  }

  private decrypt(value: string, password?: string) {
    password = password || this._password;
    const encryptedValue = EncryptionResult.parseFrom(value);
    return AESUtils.decrypt(password, encryptedValue.value, encryptedValue.salt, encryptedValue.iv);
  }

}
