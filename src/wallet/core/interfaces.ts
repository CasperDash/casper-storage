import { IHDKey } from "@/bips/bip32/hdkey/core";
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
  getKey(): TKey;

  /**
   * Returns the refrence key of wallet
   * either a private key for legacy wallet or derived path of sub-wallet of HD wallet
   */
  getReferenceKey(): string;

  /**
   * Returns the encryption type of wallet
   */
  getEncryptionType(): EncryptionType;

  /**
  * Returns the private key of wallet
  */
  getPrivateKeyByteArray(): Uint8Array;

  /**
  * Returns the public key of wallet
  */
  getPublicKeyByteArray(): Promise<Uint8Array>;

  /**
   * Returns the private key of wallet
   */
  getPrivateKey(): string;

  /**
  * Returns the public key of wallet
  */
  getPublicKey(): Promise<string>;

  /**
   * Returns the public address of wallet
   */
  getPublicAddress(): Promise<string>;

  /**
   * Returns the public hash of wallet
   */
  getPublicHash(): Promise<string>;

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
   * Get a wallet at a specific account index based on base derivation path (purpose/coinType/accountIndex)
   * @param accountIndex 
   */
  getAccount(accountIndex: number): Promise<TWallet>;

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