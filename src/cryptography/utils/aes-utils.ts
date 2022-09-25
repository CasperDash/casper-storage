import { TypeUtils } from "../../utils";
import { CryptoUtils, EncoderUtils } from ".";

/**
 * AES enryption utils
 * Provide functions to encrypt a text with a secure  password
 * and also be able to decrypt the encrypted value back to the original text with that secure password
 */
export class AESUtils {

  /**
   * Encrypts a value
   * 
   * @param {string} password - The password to encrypt valye.
   * @param {string} value - The value to encrypt.
   * @param {string} keySalt - The salt to secure the password.
   * @param {string} cipherIV - The IV to secure the encryption.
   * @param {string} mode - The AES mode to encrypt value (default is AES-GCM).
   * @returns The encrypted value.
   */
  static async encrypt(password: string, value: string, keySalt: Uint8Array, cipherIV: Uint8Array, mode = "AES-GCM"): Promise<string> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!keySalt) throw new Error("Salt is required")
    if (!cipherIV) throw new Error("IV is required")
    if (!mode) throw new Error("Encrypt mode is required")

    const crypto = CryptoUtils.getCrypto();

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(password, keySalt);
    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Encoded value
    const valueBytes = EncoderUtils.encodeText(value);
    const cipherValue = await crypto.subtle.encrypt({ name: mode, iv: cipherIV }, key, valueBytes);

    // Convert the encrypted bytes to a hex string
    const hexValue = TypeUtils.convertArrayToHexString(cipherValue);
    return hexValue;
  }

  /**
   * Decrypts a value
   * 
   * @param {string} password - The password to decrypt valye.
   * @param {string} value - The value to decrypt.
   * @param {string} keySalt - The salt to secure the password.
   * @param {string} cipherIV - The IV to secure the encryption.
   * @param {string} mode - The AES mode to decrypt value (default is AES-GCM).
   * @returns The decrypted value.
   */
  static async decrypt(password: string, value: string, keySalt: Uint8Array, cipherIV: Uint8Array, mode = "AES-GCM"): Promise<string> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!keySalt) throw new Error("Salt is required")
    if (!cipherIV) throw new Error("IV is required")
    if (!mode) throw new Error("Encrypt mode is required")

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(password, keySalt);
    const key = await crypto.subtle.importKey("raw", keyBytes, { "name": mode, length: 256 }, false, ["encrypt", "decrypt"]);

    // Convert the encrypted value into a byte array
    const valueBytes = TypeUtils.convertHexStringToArray(value);
    const decryptedValue = await crypto.subtle.decrypt({ name: mode, iv: cipherIV }, key, valueBytes);
    const decryptedText = EncoderUtils.decodeText(decryptedValue);

    return decryptedText;
  }
}