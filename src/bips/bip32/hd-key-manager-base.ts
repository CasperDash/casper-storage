import { EncryptionType, CryptoUtils } from "@/cryptography";
import { IHDKeyManager, Versions } from "./interfaces";
import { IHDKey } from "./hdkey";

/**
 * Default versions
 */
const BITCOIN_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };

export abstract class HDKeyManagerBase implements IHDKeyManager {

  protected encryptionType: EncryptionType;

  constructor(type: EncryptionType) {
    this.encryptionType = type;
  }

  public fromMasterSeed(seed: Uint8Array, versions?: Versions) {
    const { key, chainCode } = CryptoUtils.digestSHA512(seed, this.GetMasterSecret());
    return this.createNewHDKey(key, chainCode, versions || BITCOIN_VERSIONS);
  }

  protected abstract GetMasterSecret(): Uint8Array;

  protected abstract createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey;
}