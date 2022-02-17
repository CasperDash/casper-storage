import { EncryptionType } from "@/cryptography";

const ED25119_PREFIX = "01";
const SECP256_PREFIX = "02";

export class CasperWalletUtils {

  /**
   * Takes an encryption type and a public key and returns a public address
   * @param {EncryptionType} encryptionType - The type of encryption to use.
   * @param {string} publicKey - The public key of the account.
   * @returns The public address is the public key prefixed with the appropriate prefix.
   */
  public static getPublicAddress(encryptionType: EncryptionType, publicKey: string): string {
    let prefix: string;
    switch (encryptionType) {
      case EncryptionType.Ed25519  : prefix = ED25119_PREFIX; break;
      case EncryptionType.Secp256k1: prefix = SECP256_PREFIX; break;
      default: throw new Error(`The encryption type ${encryptionType} is not supported`)
    }
    return prefix + publicKey;
  }

}