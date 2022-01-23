import { IHDKey } from "@/bips/bip32/hdkey";
import { EncryptionType } from "@/cryptography";

/**
 * A specific generator to generate addresses
 */
export interface IAddressGenerator {

  /**
   * Generate the address from a public key
   * @param publicKey 
   */
  generate(publicKey: Uint8Array): string;
}

/**
 * Presents for an instance of wallet
 */
export interface IWallet<TKey> {
  /**
   * The key (private) of wallet
   */
  key: TKey;

  /**
   * The encryption mode which is used in this wallet
   */
  encryptionType: EncryptionType;

  /**
   * Returns the private key of wallet
   */
  getPrivateKey(): string;

  /**
  * Returns the public key of wallet
  */
  getPublicKey(): Promise<string>;

  /**
   * Sign the message
   * @param message 
   */
  sign(message: Uint8Array): Promise<Uint8Array>;
}

/**
 * Expose a generic way to construct a wallet
 */
export interface IWalletConstructor<TWallet extends IWallet<IHDKey>> {
  new(key: IHDKey, encryptionType: EncryptionType): TWallet;
}

/**
 * Presents for a HD wallet
 */
export interface IHDWallet<TWallet> {

  /**
   * Get the master wallet on base derivation path (purpose/coinType)
   */
  getMasterWallet(): Promise<TWallet>;

  /**
   * Get a wallet at a specific account index based on base derivation path (purpose/coinType/accountIndex/change/walletIndex)
   * Where the default accountIndex will be 0, and change will be 0 (external)
   * @param walletIndex 
   */
  getWallet(accountIndex: number, internal: boolean, walletIndex: number): Promise<TWallet>;

  /**
   * Get a wallet with a specific path
   * @param path 
   */
  getWalletFromPath(path: string): Promise<TWallet>;
}