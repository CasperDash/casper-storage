import { IHDKey } from "../bips/bip32";
import { EncryptionType } from "../cryptography";
import { ValidationResult } from "../utils";
import { IWallet } from "../wallet";
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info";

/**
 * Options to validate password
 */
export interface PasswordOptions {
  /**
   * A function to validate the password
   */
  passwordValidator: (pwd: string) => ValidationResult;

  /**
   * A regex string to validate the password
   */
  passwordValidatorRegex: string;

  /* Salt is a random value that is used to make the hash more secure. */
  salt: Uint8Array;

  /* The number of iterations to use in the PBKDF2 function. */
  iterations: number;

  /* The size of the key in bits. */
  keySize: number;
}

/**
 * Options to configure users
 */
export interface UserOptions {
  passwordOptions: Partial<PasswordOptions>;
}

/**
 * A user instance to manage HD wallet and legacy wallets with detailed information.
 * A user serialized value is secured by a secured password which is given by user.
 * We should never store user's password but its encrypted one to do extra actions.
 */
export interface IUser {
  /**
   * Update password to serialize user's information
   * @param password
   * @param options
   */
  updatePassword(
    newPassword: string,
    oldPassword: string,
    options: Partial<PasswordOptions>
  ): void;

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
   * @param id
   * @param name
   * @param legacyWallet
   */
  setWalletInfo(id: string, name: string, legacyWallet?: boolean): void;

  /**
   * Get wallet information
   * @param id
   * @param legacyWallet
   */
  getWalletInfo(id: string, legacyWallet?: boolean): WalletInfo;

  /**
   * Serialize the user information to a store-able string which is secured by user's password
   * @param encrypt
   */
  serialize(encrypt: boolean): string;

  /**
   * Deserialize the serialized and encrypted value
   * @param value
   */
  deserialize(value: string): void;

  /* This is a type guard. It is saying that the return type of `getPasswordHashingOptions()` is a
  `Pick` of the `PasswordOptions` interface. */
  getPasswordHashingOptions(): Pick<
    PasswordOptions,
    "salt" | "iterations" | "keySize"
  >;
}
