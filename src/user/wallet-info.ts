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
  private _id: string;
  private _encryptionType: EncryptionType;
  private _descriptor: WalletDescriptor;

  /**
   * Create a new wallet information with key and encryption type
   * @param id 
   * @param type 
   * @param info 
   */
  constructor(id: string, type: EncryptionType, info?: WalletDescriptor) {
    if (!id) throw new Error("Key is required");
    if (!type) throw new Error("Type is required");

    this._id = id;
    this._encryptionType = type;
    this._descriptor = WalletDescriptor.from(info);
  }

  /**
   * Get key of wallet (private key or derived path)
   */
  public get id(): string {
    return this._id;
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
   * Get the account index (only applicable for wallets from HD wallet)
   */
  public get index(): number {
    const parts = this.id.split('/');
    if (parts.length < 4) {
      throw new Error("This is not a HD wallet account");
    }
    const index = parseInt(parts[3]); // ' will be ignored
    if (isNaN(index)) {
      throw new Error("This is not a HD wallet account");
    }
    return index;
  }

  /**
   * Returns true if this is a legacy wallet
   */
  public get isLegacy(): boolean {
    return this.id.indexOf('/') < 0;
  }

  /**
   * Returns true if this is a HD wallet
   */
   public get isHDWallet(): boolean {
    return this.id.indexOf('/') >= 0;
  }

  /**
   * Override the JSOn stringify behavior to have properly properties
   */
  public toJSON() {
    return {
      id: this.id,
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
  private _id: string;
  private _encryptionType: EncryptionType;
  private _derivedWallets: WalletInfo[];

  private _keySeed: string;

  /**
   * Create a new HD wallet information with master key and encryption type
   * @param id 
   * @param encryptionType 
   */
  constructor(id: string, encryptionType: EncryptionType) {
    if (!id) throw new Error("Key is required");
    if (!encryptionType) throw new Error("Type is required");

    this._id = id;
    this._encryptionType = encryptionType;
  }

  /**
   * Get id of HD wallet
   */
  public get id() {
    return this._id;
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
      this._keySeed = KeyFactory.getInstance().toSeed(this._id);
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
      if (item.id == derivedPath) {
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
    } else {
      derived.descriptor = WalletDescriptor.from("Account " + (derived.index + 1));
    }
  }

  /**
   * Remove a derived wallet by path
   * @param derivedPath 
   */
  public removeDerivedWallet(derivedPath: string) {
    if (this._derivedWallets) {
      this._derivedWallets = this._derivedWallets.filter((x) => x.id != derivedPath);
    }
  }

  /**
   * Override the JSOn stringify behavior to have properly properties
   */
  public toJSON() {
    return {
      id: this.id,
      encryptionType: this.encryptionType,
      derives: this.derivedWallets
    }
  }
}