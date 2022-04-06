import { KeyFactory } from "../key";
import { EncryptionType } from "../cryptography";
import { TypeUtils } from "../utils";

/**
 * Descriptor of a wallet
 * e.g name, icon, etc
 */
export class WalletDescriptor {

  /**
   * Name of wallet
   */
  private _name: string;

  /**
   * Create a new instance of the `WalletDescriptor` class
   * @param {string} [name] - The name of wallet.
   */
  constructor(name?: string) {
    this._name = name;
  }

  /**
   * Get the name of wallet
   * @returns The name of wallet.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * It sets the name of wallet.
   * @param {string} name - The name of wallet.
   */
  public set name(name: string) {
    this._name = name;
  }

  /**
   * It creates a WalletDescriptor object from a string or object.
   * @param {string | WalletDescriptor} info - string | WalletDescriptor
   * @returns A WalletDescriptor object.
   */
  public static from(info: string | WalletDescriptor): WalletDescriptor {
    if (!info) {
      return new WalletDescriptor();
    }
    let descriptor: WalletDescriptor;
    if (TypeUtils.isString(info)) {
      descriptor = new WalletDescriptor(info as string);
    } else {
      const infoObj = info as WalletDescriptor;
      descriptor = new WalletDescriptor(infoObj.name);
    }
    return descriptor;
  }

  /**
   * Override the JSOn stringify behavior to have properly properties
   */
  public toJSON() {
    return {
      name: this.name,
    }
  }
}

/**
 * Wallet information
 * - Wallet key (private key or derived path)
 * - Encryption type
 * - Descriptor (name, icon, etc)
 */
export class WalletInfo {
  private _key: string;
  private _encryptionType: EncryptionType;
  private _descriptor: WalletDescriptor;

  /**
   * Create a new wallet information with key and encryption type
   * @param key 
   * @param type 
   * @param info 
   */
  constructor(key: string, type: EncryptionType, info?: WalletDescriptor) {
    if (!key) throw new Error("Key is required");
    if (!type) throw new Error("Type is required");

    this._key = key;
    this._encryptionType = type;
    this._descriptor = WalletDescriptor.from(info);
  }

  /**
   * Get key of wallet (private key or derived path)
   */
  public get key(): string {
    return this._key;
  }

  /**
   * Get the encryption type of wallet
   */
  public get encryptionType(): EncryptionType {
    return this._encryptionType;
  }

  /**
   * Get descriptor of wallet
   */
  public get descriptor(): WalletDescriptor {
    return this._descriptor;
  }

  /**
   * Set descriptor of wallet
   */
  public set descriptor(info: WalletDescriptor) {
    this._descriptor = info;
  }

  /**
   * Override the JSOn stringify behavior to have properly properties
   */
  public toJSON() {
    return {
      key: this.key,
      encryptionType: this.encryptionType,
      descriptor: this.descriptor
    }
  }
}

/**
 * HD wallet information
 * With the master key and specific encryption type
 */
export class HDWalletInfo {
  private _key: string;
  private _encryptionType: EncryptionType;
  private _derivedWallets: WalletInfo[];

  private _keySeed: string;

  /**
   * Create a new HD wallet information with master key and encryption type
   * @param key 
   * @param encryptionType 
   */
  constructor(key: string, encryptionType: EncryptionType) {
    if (!key) throw new Error("Key is required");
    if (!encryptionType) throw new Error("Type is required");

    this._key = key;
    this._encryptionType = encryptionType;
  }

  /**
   * Get key of HD wallet
   */
  public get key() { 
    return this._key;
  }

  /**
   * Get encryption type of wallet
   */
  public get encryptionType() {
    return this._encryptionType;
  }

  /**
   * Get derived wallets
   */
  public get derivedWallets() {
    return this._derivedWallets;
  }

  /**
   * Get the key-seed (from the keyphrase)
   */
  public get keySeed(): string {
    if (!this._keySeed) {
      this._keySeed = KeyFactory.getInstance().toSeed(this._key);
    }
    return this._keySeed;
  }

  /**
   * Set a derived wallet information
   * @param derivedPath 
   * @param encryptionType 
   * @param info 
   */
  public setDerivedWallet(derivedPath: string, encryptionType: EncryptionType, info?: string | WalletDescriptor) {
    if (!this._derivedWallets) this._derivedWallets = [];
    let derived: WalletInfo = null;
    for (const item of this._derivedWallets) {
      if (item.key == derivedPath) {
        derived = item;
        break;
      }
    }
    if (!derived) {
      derived = new WalletInfo(derivedPath, encryptionType);
      this._derivedWallets.push(derived);
    }
    if (info) {
      derived.descriptor = WalletDescriptor.from(info);
    }
  }
 
  /**
   * Remove a derived wallet by path
   * @param derivedPath 
   */
  public removeDerivedWallet(derivedPath: string) {
    if (this._derivedWallets) {
      this._derivedWallets = this._derivedWallets.filter((x) => x.key != derivedPath);
    }
  }

  /**
   * Override the JSOn stringify behavior to have properly properties
   */
  public toJSON() {
    return {
      key: this.key,
      encryptionType: this.encryptionType,
      derives: this.derivedWallets
    }
  }
}