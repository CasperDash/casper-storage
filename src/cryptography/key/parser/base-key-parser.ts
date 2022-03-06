import { EncoderUtils, EncryptionType, IKeyParser } from "@/cryptography";
import { KeyValue } from ".";

/**
 * Base key-parser, provider features to read and convert keys in specific formats to hex value
 */
export abstract class BaseKeyParser implements IKeyParser {

  protected encryptionType: EncryptionType;

  /**
   * Initialize the key-parser with a specific encryption type
   * @param encryptionType 
   */
  public constructor(encryptionType: EncryptionType) {
    if (!encryptionType) {
      throw new Error("Encryption type is required");
    }
    this.encryptionType = encryptionType;
  }

  /**
   * Convert the given exported PEM as base64 to private-key as a hex byte-array
   * @param content 
   * @returns 
   */
  public convertPEMToPrivateKey(content: string): KeyValue {
    return this.convertPEMToKey(content);
  }

  /**
   * Internally convert the PEM format to hex data
   * @param content 
   * @returns 
   */
  private convertPEMToKey(content: string): KeyValue {
    const data = EncoderUtils.readBase64PEM(content);
    return new KeyValue(this.parsePrivateKey(data), this.encryptionType);
  }

  /**
   * Parse the byte-array to private-key as hex data
   * @param data 
   */
  protected abstract parsePrivateKey(data: Uint8Array): Uint8Array;

}