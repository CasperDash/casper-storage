import { EncryptionType, CryptoUtils, AsymmetricKeyFactory } from "../../cryptography";
import { Hex, TypeUtils } from "../../utils";
import { IHDKeyManager, Versions } from "./core";
import { IHDKey } from "./hdkey/core";

/**
 * Default versions
 */
const BITCOIN_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };

/**
 * Minimum length of master seed
 */
const MIN_SEED_LENGTH_BITS = 128;
const MIN_SEED_LENGTH_BYTES = MIN_SEED_LENGTH_BITS / 8;

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

  public verifySeed(seed: Uint8Array) {
    if (!seed || !seed.length) {
      throw new Error("Master seed is required");
    }
    if (seed.length < MIN_SEED_LENGTH_BYTES) {
      throw new Error(`Master seed is not strong enough. Expected length is greater than or equal to ${MIN_SEED_LENGTH_BYTES} but received ${seed.length}`);
    }
  }

  /**
   * Create a new HDKey object from a seed
   * @param {Hex} seed - The seed to use to generate the master key.
   * @param {Versions} [versions] - The version of the HDKey.
   * @returns The HDKey object.
   */
  public fromMasterSeed(seed: Hex, versions?: Versions) {
    this.verifySeed(TypeUtils.parseHexToArray(seed));

    const { key, chainCode } = CryptoUtils.digestSHA512(seed, this.GetMasterSecret());
    return this.createNewHDKey(key, chainCode, versions || BITCOIN_VERSIONS);
  }

  /**
   * Construct a new HD key with valid information
   * @param privateKey 
   * @param chainCode 
   * @param versions 
   */
  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey {
    if (!this.getKeyFactory().isValidPrivateKey(privateKey)) {
      throw new Error("The master secret is bad, which produces invalid private key");
    }
    return this.createNewHDKey_Unsafe(privateKey, chainCode, versions);
  }

  /**
   * Returns the asymetric key wrapper
   */
  protected getKeyFactory() {
    return AsymmetricKeyFactory.getInstance(this.encryptionType);
  }

  /**
   * Returns the master key for the seed
   */
  protected abstract GetMasterSecret(): Uint8Array;

  /**
   * Simply construct a new HDKey from give inputs without any validation.
   */
  protected abstract createNewHDKey_Unsafe(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey;
}