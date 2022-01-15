/**
 * Represents for information of a node in HD wallet
 */
export interface IHDKey {

  /**
   * The wallet path
   */
  getPath(): string;

  /**
   * The fingerprint which is hash160 from the private key.
   * It should be 0 if this node is the master wallet.
   */
  getFingerprint(): Promise<number>;

   /**
   * The figerprint which is a hash160 from the private key of parent node.
   * It should be 0 for the master wallet.
   */
  getParentFingerPrint(): number;

  /**
   * The seed value which is generated via HMAC-SHA512 algorithm of the seed
   */
  getChainCode(): Uint8Array;

  /**
   * The key value which is generated via HMAC-SHA512 algorithm of the seed
   */
  getPrivateKey(): Uint8Array;

  /**
   * Public key which is generated from the private key
   */
  getPublicKey(): Promise<Uint8Array>;

  /**
   * The master private key
   */
  getPrivateExtendedKey(): Promise<string>;

  /**
   * The master public key
   */
  getPublicExtendedKey(): Promise<string>;

  /**
   * Derive a child node
   * @param path 
   */
  derive(path: string): Promise<IHDKey>;
}