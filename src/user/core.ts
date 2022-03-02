import { IHDKey } from "@/bips/bip32"
import { EncryptionType, IWallet } from ".."
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info"

/**
 * A user instance to manage HD wallet and legacy wallets with detailed information.
 * A user serialized value is secured by a secured password which is given by user.
 * We should never store user's password but its encrypted one to do extra actions.
 */
export interface IUser {

  /**
   * Set the HD wallet information
   * @param key the master (entropy) key
   * @param type the encryption type
   */
  setHDWallet(key: string, type: EncryptionType): void;

  /**
   * Get the HD wallet
   */
  getHDWallet(): HDWalletInfo;

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
  addWalletAccount(index: number, info?: WalletDescriptor): Promise<IWallet<IHDKey>>;

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
  addLegacyWallet(wallet: IWallet<string>, info?: WalletDescriptor);

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
}