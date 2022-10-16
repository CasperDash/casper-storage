import { EncoderUtils, EncryptionType } from "../../cryptography";
import { HDKeyManagerBase as HDKeyManagerBase } from "./hd-key-manager-base";
import { HDKeyED25519 } from "./hdkey/hd-key-ed25519";
import { IHDKey } from "./hdkey/core";
import { HDKeyConfig, Versions } from "./core";

const MASTER_SECRET = EncoderUtils.encodeText("ed25519 seed");

/**
 * A wrapper of HDKey manager which uses ed25519 underlying
 */
export class HDKeyManagerEd25519 extends HDKeyManagerBase {

  public static default = new HDKeyManagerEd25519();

  private constructor() {
    super(EncryptionType.Ed25519);
  }

  protected GetMasterSecret(): Uint8Array {
    return MASTER_SECRET;
  }

  protected createNewHDKey_Unsafe(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey {
    return new HDKeyED25519(new HDKeyConfig(this.encryptionType, versions, this.GetMasterSecret()), privateKey, chainCode, null);
  }

}