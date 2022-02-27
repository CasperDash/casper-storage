import { EncryptionType } from "@/cryptography";
import { TypeUtils } from "@/utils";

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
  private _type: EncryptionType;
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
    this._type = type;
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
  public get type(): EncryptionType {
    return this._type;
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
      type: this.type,
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
  private _type: EncryptionType;
  private _derivedWallets: WalletInfo[];

  /**
   * Create a new HD wallet information with master key and encryption type
   * @param key 
   * @param type 
   */
  constructor(key: string, type: EncryptionType) {
    if (!key) throw new Error("Key is required");
    if (!type) throw new Error("Type is required");

    this._key = key;
    this._type = type;
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
  public get type() {
    return this._type;
  }

  /**
   * Get derived wallets
   */
  public get derivedWallets() {
    return this._derivedWallets;
  }

  /**
   * Set a derived wallet information
   * @param derivedPath 
   * @param type 
   * @param info 
   */
  public setDerivedWallet(derivedPath: string, type: EncryptionType, info?: string | WalletDescriptor) {
    if (!this._derivedWallets) this._derivedWallets = [];
    let derived: WalletInfo = null;
    for (const item of this._derivedWallets) {
      if (item.key == derivedPath) {
        derived = item;
        break;
      }
    }
    if (!derived) {
      derived = new WalletInfo(derivedPath, type);
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
      type: this.type,
      derives: this.derivedWallets
    }
  }
}