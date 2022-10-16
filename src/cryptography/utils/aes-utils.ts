import { Hex, TypeUtils } from "../../utils";
import { CryptoUtils, EncoderUtils } from ".";

/**
 * Represents the result of encryption with additional data
 */
export class EncryptionResult {
  public constructor(public encryptedValue: string, public additionalData: Uint8Array) {
    // Noop
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
   * @param {string} iv - The IV for encryption, if it is null we will generate a random one and returns as a part of result.
   * @param {string} mode - The AES mode to encrypt value (default is AES-GCM).
   * @returns The encrypted value with a random generated salt
   */
  static async encrypt(password: string, value: string, iv: Uint8Array = null, mode = "AES-GCM"): Promise<EncryptionResult> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!mode) throw new Error("Encrypt mode is required")

    const crypto = CryptoUtils.getCrypto();
    iv = iv || CryptoUtils.randomBytes(16);

    const keyBytes = CryptoUtils.scrypt(password, iv);
    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Encoded value
    const valueBytes = EncoderUtils.encodeText(value);
    const cipherValue = await crypto.subtle.encrypt({ name: mode, iv: iv }, key, valueBytes);

    // Convert the encrypted bytes to a hex string
    const hexValue = TypeUtils.convertArrayToHexString(cipherValue);
    return new EncryptionResult(hexValue, iv);
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
  static async decrypt(password: string, value: Hex, iv: Uint8Array, mode = "AES-GCM"): Promise<string> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!iv) throw new Error("IV is required")
    if (!mode) throw new Error("Encrypt mode is required")

    const keyBytes = CryptoUtils.scrypt(password, iv);
    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Convert the encrypted value into a byte array
    const valueBytes = TypeUtils.parseHexToArray(value);
    const decryptedValue = await crypto.subtle.decrypt({ name: mode, iv: iv }, key, valueBytes);
    const decryptedText = EncoderUtils.decodeText(decryptedValue);

    return decryptedText;
  }
}