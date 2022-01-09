import { EncryptionType } from "@/cryptography";
import { HDKeyManagerBase as HDKeyManagerBase } from "./hd-key-manager-base";
import { HDKeyED25519 } from "./hdkey/hd-key-ed25519";
import { IHDKey } from "./hdkey";
import { HDKeyConfig, Versions } from "./interfaces";

const MASTER_SECRET = new TextEncoder().encode("ed25519 seed");

export class HDKeyManagerEd25519 extends HDKeyManagerBase {

  public static default = new HDKeyManagerEd25519();

  private constructor() {
    super(EncryptionType.Ed25519);
  }

  protected GetMasterSecret(): Uint8Array {
    return MASTER_SECRET;
  }

  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, versions: Versions) : IHDKey {
    return new HDKeyED25519(new HDKeyConfig(this.encryptionType, versions, this.GetMasterSecret()), privateKey, chainCode, null);
  }

}