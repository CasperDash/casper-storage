import { EncryptionType, CryptoUtils } from "@/cryptography";
import { IHDKeyManager, Versions } from "./interfaces";
import { IHDKey } from "./hdkey/core";

/**
 * Default versions
 */
const BITCOIN_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };

export abstract class HDKeyManagerBase implements IHDKeyManager {

  protected encryptionType: EncryptionType;

  /**
   * The constructor function takes a single parameter, which is the encryption type
   * @param {EncryptionType} type - EncryptionType
   */
  constructor(type: EncryptionType) {
    this.encryptionType = type;
  }

  /**
   * Create a new HDKey object from a seed
   * @param {Uint8Array} seed - The seed to use to generate the master key.
   * @param {Versions} [versions] - The version of the HDKey.
   * @returns The HDKey object.
   */
  public fromMasterSeed(seed: Uint8Array, versions?: Versions) {
    if (!seed || !seed.length) {
      throw new Error("Master seed is required");
    }

    const { key, chainCode } = CryptoUtils.digestSHA512(seed, this.GetMasterSecret());
    return this.createNewHDKey(key, chainCode, versions || BITCOIN_VERSIONS);
  }

  protected abstract GetMasterSecret(): Uint8Array;

  protected abstract createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey;
}