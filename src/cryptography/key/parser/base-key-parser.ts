import { EncoderUtils } from "@/cryptography";

/**
 * Base key-parser, provider features to read and convert keys in specific formats to standard hex format.
 */
export abstract class BaseKeyParser {

  /**
   * Conver the given exported PEM as base64 to private-key as a hex bytearray
   * @param content 
   * @returns 
   */
  public convertPEMToPrivateKey(content: string): Uint8Array {
    return this.convertPEMToKey(content);
  }

  /**
   * Internally convert the PEM format to hex data
   * @param content 
   * @returns 
   */
  private convertPEMToKey(content: string): Uint8Array {
    const data = EncoderUtils.readBase64PEM(content);
    return this.parsePrivateKey(data);
  }

  /**
   * Parse the byte-array to private-key as hex data
   * @param data 
   */
  protected abstract parsePrivateKey(data: Uint8Array): Uint8Array;

}