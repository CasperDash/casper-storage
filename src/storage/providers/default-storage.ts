import { AESUtils } from "../../cryptography";
import { PasswordOptions } from "../../cryptography/password-options";
import { TypeUtils } from "../../utils";
import { IStorage } from "../interfaces";

const ENCRYPTED_PREFIX = "cps_encrypted_";

/**
 * Simple wrapper for localStorage of browser
 */
export class DefaultStorage implements IStorage {

  private _pwdOptions: PasswordOptions;

  constructor(pwdOptions: PasswordOptions) {
    this._pwdOptions = pwdOptions;

    if (!this._pwdOptions) {
      throw new Error("Password is required");
    }
  }

  public async set(key: string, value: string, pwdOptions?: PasswordOptions): Promise<void> {
    const encryptedValue = await this.encrypt(value, pwdOptions);
    return this.getStorage().setItem(key, ENCRYPTED_PREFIX + encryptedValue.encryptedValue);
  }

  public async get(key: string, pwdOptions?: PasswordOptions): Promise<string> {
    const value = this.getStorage().getItem(key);
    if (TypeUtils.isString(value) && value.startsWith(ENCRYPTED_PREFIX)) {
      return this.decrypt(value.substring(ENCRYPTED_PREFIX.length), pwdOptions);
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

  public async updatePassword(newPassword: PasswordOptions): Promise<void> {
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
    this._pwdOptions = newPassword;
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

  private async encrypt(value: string, pwdOptions?: PasswordOptions) {
    pwdOptions = pwdOptions || this._pwdOptions;
    const encryptionValue = await AESUtils.encrypt(pwdOptions.password, value, pwdOptions.salt);
    return encryptionValue;
  }

  private decrypt(value: string, pwdOptions?: PasswordOptions) {
    pwdOptions = pwdOptions || this._pwdOptions;
    return AESUtils.decrypt(pwdOptions.password, value, pwdOptions.salt);
  }

}
