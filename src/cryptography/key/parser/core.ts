import { EncryptionType } from "@/cryptography"

/**
 * Key value to expose the raw key in byte-array data and its encryption type
 */
export class KeyValue  {
  private _key: Uint8Array;
  private _encryptionType: EncryptionType;

  /**
   * Initialize the KeyValue with specific raw-key and encryption type
   * @param key 
   * @param encryptionType 
   */
  public constructor(key: Uint8Array, encryptionType: EncryptionType) {
    if (!key || !key.length) {
      throw new Error("Key is required");
    }
    if (!encryptionType) {
      throw new Error("Encryption type is required");
    }

    this._key = key;
    this._encryptionType = encryptionType;
  }

  /**
   * Get the current raw-key value
   */
  public get key(): Uint8Array {
    return this._key;
  }

  /**
   * Get the encryption type of key
   */
  public get encryptionType(): EncryptionType {
    return this._encryptionType;
  }
}

/**
 * Key-parser providers features to read and convert keys in specific formats to hex value
 */
export interface IKeyParser {

  /**
   * Convert the given exported PEM as base64 to private-key as a hex bytearray
   * @param content 
   * @returns 
   */
  convertPEMToPrivateKey(content: string): KeyValue;
}
