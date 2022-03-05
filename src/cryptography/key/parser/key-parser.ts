import { EncryptionType } from "@/cryptography";
import { BaseKeyParser } from "./base-key-parser";
import { Ed25519KeyParser } from "./ed25519-key-parser";
import { Secp256k1KeyParser } from "./secp256k1-key-parser";

const edParser = new Ed25519KeyParser();
const secParser = new Secp256k1KeyParser();

/**
 * Key-parser provides a parser to parse the keys from a specific format (currently which is exported from casper-sign) to standard hex data
 */
export class KeyParser {

  /**
   * Get an instance of key-parser based on an encryption type
   * @param encryptionType 
   * @returns 
   */
  public static getInstance(encryptionType: EncryptionType): BaseKeyParser {
    switch (encryptionType) {
      case EncryptionType.Ed25519: return edParser;
      case EncryptionType.Secp256k1: return secParser;
      default:
        throw new Error(`Unsupported encryption type ${encryptionType}`);
    }
  }
}