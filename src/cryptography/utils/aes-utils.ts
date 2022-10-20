import { Hex, TypeUtils } from "../../utils";
import { CryptoUtils, EncoderUtils } from ".";

/**
 * Represents the result of encryption with additional data
 */
export class EncryptionResult {

  /**
   * Parse the encrypted value back the result
   * @param encryptedValue 
   * @returns 
   */
  public static parseFrom(encryptedValue: string) {
    const valueObj = JSON.parse(encryptedValue);
    return new EncryptionResult(valueObj.value, new Uint8Array(valueObj.salt), new Uint8Array(valueObj.iv));
  }

  public constructor(public value: string, public salt: Uint8Array, public iv: Uint8Array) {
    // Noop
  }

  /**
   * Serialize encryption result to a string
   * @returns 
   */
  public toString(): string {
    return JSON.stringify({ value: this.value, salt: Array.from(this.salt), iv: Array.from(this.iv) });
  }

}

/**
 * AES enryption utils
 * Provide functions to encrypt a text with a secure  password
 * and also be able to decrypt the encrypted value back to the original text with that secure password
 */
export class AESUtils {

  /**
   * Encrypts a value
   * 
   * @param {string} password - The password to encrypt value.
   * @param {string} value - The value to encrypt.
   * @param {string} mode - The AES mode to encrypt value (default is AES-GCM).
   * @returns The encrypted value with a random generated salt
   */
  static async encrypt(password: string, value: string, mode = "AES-GCM"): Promise<EncryptionResult> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!mode) throw new Error("Encrypt mode is required")

    const crypto = CryptoUtils.getCrypto();
    
    const salt = CryptoUtils.randomBytes(16);
    const iv = CryptoUtils.randomBytes(16);

    const keyBytes = CryptoUtils.scrypt(password, salt);

    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Encoded value
    const valueBytes = EncoderUtils.encodeText(value);
    const cipherValue = await crypto.subtle.encrypt({ name: mode, iv: iv }, key, valueBytes);

    // Convert the encrypted bytes to a hex string
    const hexValue = TypeUtils.convertArrayToHexString(cipherValue);
    return new EncryptionResult(hexValue, salt, iv);
  }

  /**
   * Decrypts a value
   * 
   * @param {string} password - The password to decrypt value.
   * @param {string} value - The value to decrypt.
   * @param {string} iv - The additional data for encryption.
   * @param {string} mode - The AES mode to decrypt value (default is AES-GCM).
   * @returns The decrypted value.
   */
  static async decrypt(password: string, value: Hex, salt: Hex, iv: Hex, mode = "AES-GCM"): Promise<string> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!salt) throw new Error("Salt is required")
    if (!iv) throw new Error("IV is required")
    if (!mode) throw new Error("Encrypt mode is required");

    // Parse to array
    salt = TypeUtils.parseHexToArray(salt);
    iv = TypeUtils.parseHexToArray(iv);

    const keyBytes = CryptoUtils.scrypt(password, salt);
    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Convert the encrypted value into a byte array
    const valueBytes = TypeUtils.parseHexToArray(value);
    const decryptedValue = await crypto.subtle.decrypt({ name: mode, iv: iv }, key, valueBytes);
    const decryptedText = EncoderUtils.decodeText(decryptedValue);

    return decryptedText;
  }
}