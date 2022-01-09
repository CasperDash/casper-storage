import { EncryptionType } from "@/cryptography";
import { IHDKey } from "./hdkey";

export class Versions {
  private: number;
  public: number;
}

export class HDKeyConfig {
  encryptionType: EncryptionType;
  versions: Versions;
  masterSecret: Uint8Array;

  constructor(type: EncryptionType, versions: Versions, masterSecret: Uint8Array) {
    this.encryptionType = type;
    this.versions = versions;
    this.masterSecret = masterSecret;
  }
}

export interface IHDKeyManager {
  fromMasterSeed(seed: Uint8Array, versions?: Versions): IHDKey;
}
