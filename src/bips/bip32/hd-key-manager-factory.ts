import { EncryptionType } from "@/cryptography";
import { HDKeyManagerEd25519 } from "./hd-key-manager-ed25519";
import { HDKeyManagerSecp256k1 } from "./hd-key-manager-secp256k1";
import { IHDKeyManager } from "./interfaces";

/**
 * The factory to provide HDKey manager based on encryption type
 */
export class HDKeyManagerFactory {

  /**
   * Returns an instance of HDKey manager based on encryption algo
   * @param encryptionType either Ed25519 or Secp256k1
   * @returns 
   */
  public static getInstance(encryptionType: EncryptionType): IHDKeyManager {
    switch (encryptionType) {
      case EncryptionType.Ed25519: return HDKeyManagerEd25519.default;
      case EncryptionType.Secp256k1: return HDKeyManagerSecp256k1.default;
      default: throw new Error(`The encryption type ${encryptionType} is not supported`);
    }
  }

  /**
   * Get an instance of Ed25519-based HD key manager
   */
  public static getEd25519KeyManager(): IHDKeyManager {
    return HDKeyManagerFactory.getInstance(EncryptionType.Ed25519);
  }

  /**
   * Get an instance of Secp256k1-based HD key manager
   */
  public static getSecp256k1KeyManager(): IHDKeyManager {
    return HDKeyManagerFactory.getInstance(EncryptionType.Secp256k1);
  }

}