import { EncryptionType, CryptoUtils } from "@/cryptography";
import { Hex } from "@/utils";
import { IHDKeyManager, Versions } from "./core";
import { IHDKey } from "./hdkey/core";

/**
 * Default versions
 */
const BITCOIN_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };

/**
 * Base HDKey manager, to initialize the root key from the master seed.
 */
export abstract class HDKeyManagerBase implements IHDKeyManager {

  private _encryptionType: EncryptionType;

  /**
   * The constructor function takes a single parameter, which is the encryption type
   * @param {EncryptionType} encryptionType - EncryptionType
   */
  constructor(encryptionType: EncryptionType) {
    this._encryptionType = encryptionType;
  }

  /**
   * Get the underlying encryption type
   */
  public get encryptionType() {
    return this._encryptionType;
  }

  /**
   * Create a new HDKey object from a seed
   * @param {Hex} seed - The seed to use to generate the master key.
   * @param {Versions} [versions] - The version of the HDKey.
   * @returns The HDKey object.
   */
  public fromMasterSeed(seed: Hex, versions?: Versions) {
    if (!seed || !seed.length) {
      throw new Error("Master seed is required");
    }

    const { key, chainCode } = CryptoUtils.digestSHA512(seed, this.GetMasterSecret());
    return this.createNewHDKey(key, chainCode, versions || BITCOIN_VERSIONS);
  }

  /**
   * Get the master key for the seed
   */
  protected abstract GetMasterSecret(): Uint8Array;

  /**
   * Construct a new HD key with valid information
   * @param privateKey 
   * @param chainCode 
   * @param versions 
   */
  protected abstract createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey;
}