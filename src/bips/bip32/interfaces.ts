import { EncryptionType } from "@/cryptography";
import { IHDKey } from "./hdkey";

/**
 * Versions to serialize private/public keys.
 * (mainnet: 0x0488B21E public, 0x0488ADE4 private; testnet: 0x043587CF public, 0x04358394 private)
 */
export class Versions {
  /**
   * version to serialize private key
   */
  private: number;

  /**
   * Version to serialize public key
   */
  public: number;
}

/**
 * The options to initialize a new HD wallet
 */
export class HDKeyConfig {

  /**
   * The encryption mode likes ed25119 or secp256k1
   */
  encryptionType: EncryptionType;

  /**
   * The versions to serialize private/public key (for mainnet or testnet)
   */
  versions: Versions;

  /**
   * The master secret
   */
  masterSecret: Uint8Array;

  /**
   * Ctor
   * @param type the encryptionn mode
   * @param versions the versions to serialize private/public key
   * @param masterSecret the master secret to use for the master-seed for HMAC0-SHA512 process
   */
  constructor(type: EncryptionType, versions: Versions, masterSecret: Uint8Array) {
    this.encryptionType = type;
    this.versions = versions;
    this.masterSecret = masterSecret;
  }
}

export interface IHDKeyManager {
  fromMasterSeed(seed: Uint8Array, versions?: Versions): IHDKey;
}
