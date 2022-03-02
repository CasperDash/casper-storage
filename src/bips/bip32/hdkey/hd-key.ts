import { AsymmetricKeyFactory, CryptoUtils } from "@/cryptography";
import { IHDKey } from ".";
import { HDKeyConfig } from "../interfaces";

/**
 * Length of fields to serialize a data presents for a HD key
 * 4 bytes: Version byte (mainnet: 0x0488B21E public, 0x0488ADE4 private; testnet: 0x043587CF public, 0x04358394 private)
 * 1 byte: Depth (0x00 for master, 0x01 for next level derived keys)
 * 4 bytes: The fingerprint of parent's key (0x00000000 for master)
 * 4 bytes: child index (0x00000000 if master key)
 * 32 bytes: chain code
 * 33 bytes: the public key or private key
 */
const LENGHT = 78;
const HARDENED_OFFSET = 0x80000000;
const ZERO_BYTES = new Uint8Array([0]);

/**
 * A component for BIP32
 * Original source code from https://github.com/cryptocoinjs/hdkey.
 * Refer and take inspiration to implement a generic HDKey
 */
export abstract class HDKey implements IHDKey {

  protected config: HDKeyConfig;

  protected privateKey : Uint8Array;
  protected chainCode: Uint8Array;

  protected publicKey: Uint8Array;
  protected path = "m"; // Default master path
  protected depth = 0x00;
  protected index = 0x00000000;
  protected parentFingerprint = 0x00000000;

  /**
   * Construct a new HD key
   * @param config drive the encryption mode and address generator
   * @param privateKey the private key
   * @param chainCode the chain code
   * @param publicKey optional public key to derive children
   */
  constructor(config: HDKeyConfig, privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) {
    this.config     = config;
    this.privateKey = privateKey;
    this.chainCode  = chainCode;
    this.publicKey  = publicKey;
  }

  /**
   * Returns the current path
   * @returns 
   */
     public getPath(): string {
      return this.path;
    }

  /**
   * Returns the private key Uint8Array
   * @returns 
   */
  public getPrivateKey(): Uint8Array {
    return this.privateKey;
  }

  /**
   * Returns the chain code Uint8Array
   * @returns 
   */
  public getChainCode(): Uint8Array {
    return this.chainCode;
  }

  /**
   * Returns the public key Uint8Array
   * @returns 
   */
  async getPublicKey(): Promise<Uint8Array> {
    if (!this.publicKey) {
      const publicKey = await this.getKeyFactory().createPublicKey(this.privateKey, true);
      this.publicKey = Uint8Array.from(publicKey);
    }
    return Promise.resolve(this.publicKey);
  }

  /**
   * Returns the private extended key (hex string)
   * @returns 
   */
  public async getPrivateExtendedKey(): Promise<string> {
    if (!this.privateKey) {
      throw new Error("Cannot compute privateExtendedKey without privateKey");
    }
    const data = new Uint8Array([...ZERO_BYTES, ...this.privateKey]);
    const result = CryptoUtils.base58Encode(this.serialize(this.config.versions.private, data));
    return Promise.resolve(result);
  }

  /**
   * Returns the public extended key (hex string)
   * @returns 
   */
  public async getPublicExtendedKey(): Promise<string> {
    const publicKey = await this.getPublicKey();
    return Promise.resolve(CryptoUtils.base58Encode(this.serialize(this.config.versions.public, publicKey)));
  }

  /**
   * Returns the fingerprint
   */
  public async getFingerprint(): Promise<number> {
    const publicKey = await this.getPublicKey();
    const identifier = CryptoUtils.hash160(publicKey);
    const view = new DataView(identifier.buffer, 0);
    const fingerprint = view.getUint32(0);
    return Promise.resolve(fingerprint);
  }

  /**
   * Returns the parent fingerprint
   */
  public getParentFingerPrint(): number {
    return this.depth === 0 ? 0x00000000 : this.parentFingerprint;
  }

  /**
   * Derive a HD key from the given path
   * @param path 
   * @returns 
   */
  public async derive(path: string): Promise<IHDKey> {
    // eslint-disable-next-line  @typescript-eslint/no-this-alias
    let hdKey: HDKey = this;

    // BIP32: a path starts with m character
    if (path === "m" || path === 'M' || path === "m'" || path === "M'") {
      return Promise.resolve(hdKey);
    }

    // Parts of path are separated by /
    const levels = path.split("/");
    let accumulatedPath = "";

    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      const level = levels[levelIndex];

      if (levelIndex > 0) accumulatedPath += "/";
      accumulatedPath += level;

      if (levelIndex === 0) {
        if (level !== "m" && level !== "M") {
          throw new Error("Path must start with m or M");
        }
        continue;
      }

      let childIndex = parseInt(level, 10);
      if (childIndex >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }

      childIndex = this.getHardenedIndex(childIndex, (level.length > 1) && (level[level.length - 1] === "'"));

      hdKey = await hdKey.deriveChild(childIndex);
      hdKey.path = accumulatedPath;
    }
  
    return Promise.resolve(hdKey);
  }

  protected createChildHDKeyFromData(index: number, data: Uint8Array) : Promise<HDKey> {
    const { key, chainCode } = CryptoUtils.digestSHA512(data, this.getChainCode());
    return this.createChildHDKey(index, key, chainCode, null);
  }

  protected async createChildHDKey(index: number, privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) : Promise<HDKey> {
    const key = this.createNewHDKey(privateKey, chainCode, publicKey);
    key.index = index;
    key.depth = this.depth + 1;
    key.parentFingerprint = await this.getFingerprint();
    return key;
  }

  protected abstract deriveChild(index: number): Promise<HDKey>;

  protected abstract createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array): HDKey;

  protected getHardenedOffset() {
    return HARDENED_OFFSET;
  }

  /**
   * Index should be hardened
   * @param index 
   * @param hardened 
   * @returns 
   */
  protected getHardenedIndex(index: number, hardened: boolean) {
    if (hardened) index += this.getHardenedOffset();
    return index;
  }

  /**
   * Combine all relevance information of current node into a single array
   * @param version of private key or public key
   * @param key either private key of public key
   * @returns 
   */
  private serialize(version: number, key: Uint8Array): Uint8Array{
    const ab = new ArrayBuffer(LENGHT);
    const view = new DataView(ab);

    view.setUint32(0, version);
    view.setUint8(4, this.depth);

    const fingerprint = this.getParentFingerPrint();
    view.setUint32(5, fingerprint);
    view.setUint32(9, this.index);

    this.getChainCode().forEach((val, index) => {
      view.setUint8(13 + index, val); 
    });
    key.forEach((val, index) => {
      view.setUint8(45 + index, val); 
    });
  
    return new Uint8Array(ab);
  }

  /**
   * Get the asymetric key wrapper to serialize data
   * @returns 
   */
  protected getKeyFactory() {
    return AsymmetricKeyFactory.getInstance(this.config.encryptionType);
  }
}