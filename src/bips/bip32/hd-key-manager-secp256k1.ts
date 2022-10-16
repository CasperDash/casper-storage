import { EncoderUtils, EncryptionType } from "../../cryptography";
import { HDKeyManagerBase as HDKeyManagerBase } from "./hd-key-manager-base";
import { IHDKey } from "./hdkey/core";
import { HDKeySecp256k1 } from "./hdkey/hd-key-secp256k1";
import { HDKeyConfig, Versions } from "./core";

const MASTER_SECRET = EncoderUtils.encodeText("Bitcoin seed");

/**
 * A wrapper of HDKey manager which uses ed25519 underlying
 */
export class HDKeyManagerSecp256k1 extends HDKeyManagerBase {

  public static default = new HDKeyManagerSecp256k1();

  private constructor() {
    super(EncryptionType.Secp256k1);
  }

  protected GetMasterSecret(): Uint8Array {
    return MASTER_SECRET;
  }

  protected createNewHDKey_Unsafe(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey {
    return new HDKeySecp256k1(new HDKeyConfig(this.encryptionType, versions, this.GetMasterSecret()), privateKey, chainCode, null);
  }

}