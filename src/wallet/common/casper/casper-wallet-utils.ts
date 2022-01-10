import { EncryptionType } from "@/cryptography";

const ED25119_PREFIX = "01";
const SECP256_PREFIX = "02";

export class CasperWalletUtils {
  public static getAddress(encryptionType: EncryptionType, publicKey: string): string {
    let prefix: string;
    switch (encryptionType) {
      case EncryptionType.Ed25519  : prefix = ED25119_PREFIX; break;
      case EncryptionType.Secp256k1: prefix = SECP256_PREFIX; break;
      default: throw new Error(`The encryption type ${encryptionType} is not supported`)
    }
    return prefix + publicKey;
  }
}