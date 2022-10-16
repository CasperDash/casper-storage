import { IHDKey } from "../bips/bip32";
import { EncryptionType } from "../cryptography";
import { IPasswordOptions, IPasswordValidator } from "../cryptography/password-options";
import { IWallet } from "../wallet";
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info";

/**
 * Options to configure users
 */
export interface IUserOptions {
  passwordOptions: Partial<IPasswordOptions>;
  passwordValidator: Partial<IPasswordValidator>;
}

/**
 * Represents for the encryption value,
 * with the encrypted value as a string and the updated password options with a new salt.
 */
export class EncryptionValue {
  public constructor(public value: string, public passwordOptions: IPasswordOptions) {
  }
}

/**
 * A user instance to manage HD wallet and legacy wallets with detailed information.
 * A user serialized value is secured by a secured password which is given by user.
 * We should never store user's password but its encrypted one to do extra actions.
 */
export interface IUser {

  /**
   * Update password to serialize user's information
   * @param newPassword
   * @param options
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Set the HD wallet information
   * @param key the master keyphrase (12-24 words)
   * @param type the encryption type
   */
  setHDWallet(key: string, type: EncryptionType): void;

  /**
   * Get the HD wallet
   */
  getHDWallet(): HDWalletInfo;

  /**
   * Check if we set the HD wallet already
   */
  hasHDWallet(): boolean;

  /**
   * Get the HD wallet account for the given index
   * @param index account index
   */
  getWalletAccount(index: number): Promise<IWallet<IHDKey>>;

  /**
   * Get the HD wallet account for the given reference key (path)
   * @param refKey account ref key (path)
   */
  getWalletAccountByRefKey(refKey: string): Promise<IWallet<IHDKey>>;

  /**
   * Add an account for HD wallet
   * @param index
   * @param info
   */
  addWalletAccount(
    index: number,
    info?: WalletDescriptor
  ): Promise<IWallet<IHDKey>>;

  /**
   * Remove an account from HD wallet
   * @param index
   */
  removeWalletAccount(index: number): void;

  /**
   * Add a legacy wallet
   * @param wallet
   * @param info
   */
  addLegacyWallet(wallet: IWallet<string>, info?: WalletDescriptor): void;

  /**
   * Get all current legacy wallets
   */
  getLegacyWallets(): WalletInfo[];

  /**
   * Check if we have any legacy wallets
   */
  hasLegacyWallets(): boolean;

  /**
   * Set wallet information
   * @param id coule be id or uid from wallet info in case of updating,
   * otherwise it must be an id (private key of legacy wallet or path of hd wallet)
   * @param name
   */
  setWalletInfo(id: string, name: string): void;

  /**
   * Get wallet information
   * @param id could be id or uid of from wallet info
   */
  getWalletInfo(id: string): WalletInfo;

  /**
   * Remove a wallet from user
   * @param id could be id or uid of from wallet info
   */
  removeWalletInfo(id: string): void;

  /**
   * Serialize the user information to a store-able string which is secured by user's password.
   * Everytime we call this method, a new salt will be generated and update directly to the current user instance.
   * The caller must also store it in order to re-use later.
   */
  serialize(): Promise<EncryptionValue>;

  /**
   * Deserialize the serialized and encrypted value
   * @param value
   */
  deserialize(value: string): Promise<void>;

  /**
   * Encrypt the given value by user's password.
   * Everytime we call this method, a new salt will be generated and update directly to the current user instance.
   * The caller must also store it in order to re-use later.
   * @param value 
   */
  encrypt(value: string): Promise<EncryptionValue>;

  /**
   * Decrypt the given value by user's password
   * @param value 
   */
  decrypt(value: string): Promise<string>;

  /*
  * Get the current options for password and encryption
  */
  getPasswordOptions(): IPasswordOptions;
}
