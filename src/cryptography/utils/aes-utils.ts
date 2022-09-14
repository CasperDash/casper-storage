import { NativeModules } from "react-native";
const Aes = NativeModules.Aes;
const aesMode = "aes-256-cbc";

import { CryptoUtils } from ".";

/**
 * AES enryption utils
 * Provide functions to encrypt a text with a secure  password
 * and also be able to decrypt the encrypted value back to the original text with that secure password
 */
export class AESUtils {

  /**
   * Encrypt a string using AES in CTR mode
   * @param {string} key - The key to use for encryption.
   * @param {string} value - The value to encrypt.
   * @returns The encrypted value.
   */
  static async encrypt(key: string, value: string): Promise<string> {
    if (!key) {
      throw new Error("Key is required")
    }
    if (!value) {
      throw new Error("Value is required")
    }

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(key);

    const iv = await Aes.randomKey(16);
    const cipher = await Aes.encrypt(value, keyBytes, iv, aesMode);
    const text = JSON.stringify({ iv, cipher });
    return text;
  }

  /**
   * It decrypts the encrypted value using the key.
   * @param {string} key - The key used to encrypt the value.
   * @param {string} encryptedValue - The encrypted value that you want to decrypt.
   * @returns The decrypted value.
   */
  static async decrypt(key: string, encryptedValue: string): Promise<string>  {
    if (!key) {
      throw new Error("Key is required")
    }
    if (!encryptedValue) {
      throw new Error("Encrypted value is required")
    }

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(key);

    const encryptedData = JSON.parse(encryptedValue);
    const text = await Aes.decrypt(encryptedData.cipher, keyBytes, encryptedData.iv, aesMode);

    return text;
  }
}