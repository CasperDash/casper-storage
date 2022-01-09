import { EncryptionType } from "../core";
import { Secp256k1 } from "./secp256k1";
import { Ed25519 } from "./ed25519";
import { IAsymmetricKey } from "./interfaces";

export class AsymmetricKeyFactory {

  /**
   * Returns the asynmmetric key to work with a specific encryption mode
   * @param type 
   * @returns 
   */
  static getInstance(type: EncryptionType)  : IAsymmetricKey {
    switch (type) {
      case EncryptionType.Ed25519  : return Ed25519;
      case EncryptionType.Secp256k1: return Secp256k1;
      default: throw new Error(`The encryption type ${type} is not supported`);
    }
  }

}