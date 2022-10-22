import { IHDKey } from "../../bips/bip32/hdkey/core";
import { EncryptionType } from "../../cryptography";

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
   * either the private key of legacy wallet or a key holder of a HD wallet
   */
  getKey(): TKey;

  /**
   * Returns the reference key of wallet
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
  * Returns the raw public key of wallet, which is computed from the private key
  */
  getRawPublicKeyByteArray(): Promise<Uint8Array>;

  /**
  * Returns the public key of wallet, which is formated depends on chains
  */
  getPublicKeyByteArray(): Promise<Uint8Array>;

  /**
  * Returns the public address of wallet, depends on each chain we use different methods to produce it from the public key (e.g hashing)
  */
  getPublicAddressByteArray(): Promise<Uint8Array>;

  /**
   * Returns the private key of wallet
   */
  getPrivateKey(): string;

  /**
  * Returns the raw public key of wallet, which is computed from the private key
  */
  getRawPublicKey(): Promise<string>;

  /**
   * Returns the formatted public key of wallet, depends on each chain one will format/prefix the public key with different values
   */
  getPublicKey(): Promise<string>;

  /**
   * Returns the public address of wallet, depends on each chain we use different methods to produce it from the public key (e.g hashing)
   */
  getPublicAddress(): Promise<string>;

  /**
   * Returns the private key of wallet in PEM format
   */
  getPrivateKeyInPEM(): string;

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
   * Returns the master key from master seed
   */
  getMasterKey(): IHDKey;

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