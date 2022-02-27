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
  public private: number;

  /**
   * Version to serialize public key
   */
   public public: number;

}

/**
 * The options to initialize a new HD wallet
 */
export class HDKeyConfig {

  /**
   * The encryption mode likes ed25119 or secp256k1
   */
  public encryptionType: EncryptionType;

  /**
   * The versions to serialize private/public key (for mainnet or testnet)
   */
   public versions: Versions;

  /**
   * The master secret
   */
   public masterSecret: Uint8Array;

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

/**
 * HD key manager, to initialize the root HD key from master seed
 */
export interface IHDKeyManager {

  /**
   * Create a new HDKey object from a seed
   * @param {Uint8Array} seed - The seed to use to generate the master key.
   * @param {Versions} [versions] - The version of the HDKey.
   * @returns The HDKey object.
   */
  fromMasterSeed(seed: Uint8Array, versions?: Versions): IHDKey;

}
