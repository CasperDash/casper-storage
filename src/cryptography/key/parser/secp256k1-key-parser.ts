import { BaseKeyParser } from "./base-key-parser";
import KeyEncoder from "key-encoder";
import { TypeUtils } from "../../../utils";
import { EncryptionType } from "../../../cryptography";

const keyEncoder = new KeyEncoder('secp256k1');

/**
 * Specific implementation of Secp256k1 to parse keys
 */
export class Secp256k1KeyParser extends BaseKeyParser {

  public constructor() {
    super(EncryptionType.Secp256k1);
  }

  protected parsePrivateKey(data: Uint8Array): Uint8Array {
    return this.parseKey(data);
  }

  private parseKey(data: Uint8Array): Uint8Array {
    const key = keyEncoder.encodePrivate(TypeUtils.convertArrayToHexString(data), 'der', 'raw'); // Convert digital certificate format to raw format
    return TypeUtils.convertHexStringToArray(key);
  }

}