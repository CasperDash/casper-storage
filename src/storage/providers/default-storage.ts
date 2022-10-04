import { AESUtils } from "../../cryptography";
import { Password } from "../../cryptography/password";
import { TypeUtils } from "../../utils";
import { IStorage } from "../interfaces";

const ENCRYPTED_PREFIX = "cps_encrypted_";

/**
 * Simple wrapper for localStorage of browser
 */
export class DefaultStorage implements IStorage {

  private _password: Password;

  constructor(password: Password) {
    this._password = password;

    if (!this._password) {
      throw new Error("Password is required");
    }
  }

  public async set(key: string, value: string, password?: Password): Promise<void> {
    const encryptedValue = await this.encrypt(value, password);
    return this.getStorage().setItem(key, ENCRYPTED_PREFIX + encryptedValue);
  }

  public async get(key: string, password?: Password): Promise<string> {
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

  public async updatePassword(newPassword: Password): Promise<void> {
    // Resync all existing keys
    const keys = await this.getKeys();
    if (keys && keys.length) {
      for (const key of keys) {
        // Get the existing item with previous password
        const value = await this.get(key);
        // And set back with the new password
        await this.set(key, value, newPassword);
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

  private encrypt(value: string, password?: Password) {
    password = password || this._password;
    return AESUtils.encrypt(password.getPassword(), value, password.getSalt(), password.getSalt());
  }

  private decrypt(value: string, password?: Password) {
    password = password || this._password;
    return AESUtils.decrypt(password.getPassword(), value, password.getSalt(), password.getSalt());
  }

}
