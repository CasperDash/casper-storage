import { EncryptionType } from "../../../cryptography";
import { KeyValue } from ".";
import { IKeyParser } from "./core";
import { KeyParser } from "./key-parser";

/**
 * Auto key-parser, try to guess the encryption type from the content and use the properly one
 */
export class AutoKeyParser implements IKeyParser {

  public convertPEMToPrivateKey(content: string): KeyValue {
    if (!content) {
      throw new Error("PEM content is required");
    }
    const keyParser = this.guessKeyParser(content);
    return keyParser.convertPEMToPrivateKey(content);
  }

  private guessKeyParser(content: string): IKeyParser {
    // The exported PEM file of Secp256k1 will contains specific BEGIN EC PRIVATE KEY prefix
    if (content.toUpperCase().indexOf("EC PRIVATE KEY") > 0) {
      return KeyParser.getInstance(EncryptionType.Secp256k1);
    } else {
      // And for Ed25519 it would be simple BEGIN PRIVATE KEY
      return KeyParser.getInstance(EncryptionType.Ed25519);
    }
  }

}
