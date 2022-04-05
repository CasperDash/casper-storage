import aes from "aes-js";
import { TypeUtils } from "../../utils";
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
  static encrypt(key: string, value: string) : string {
    if (!key) {
      throw new Error("Key is required")
    }
    if (!value) {
      throw new Error("Value is required")
    }

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(key);
    // Convert the value into a byte array
    const textBytes = aes.utils.utf8.toBytes(value);

    // use CTR - Counter mode (recommended method)
    const aesCtr = new aes.ModeOfOperation.ctr(keyBytes);
    const encryptedBytes = aesCtr.encrypt(textBytes);

     // Convert the encrypted bytes to a hex string
     const text = TypeUtils.convertArrayToHexString(encryptedBytes);

    return text;
  }

  /**
   * It decrypts the encrypted value using the key.
   * @param {string} key - The key used to encrypt the value.
   * @param {string} encryptedValue - The encrypted value that you want to decrypt.
   * @returns The decrypted value.
   */
  static decrypt(key: string, encryptedValue: string) : string {
    if (!key) {
      throw new Error("Key is required")
    }
    if (!encryptedValue) {
      throw new Error("Encrypted value is required")
    }

    // Ensure to have a strong private key
    const keyBytes = CryptoUtils.scrypt(key);
    // Convert the encrypted value into a byte array
    const encryptedTextBytes = TypeUtils.convertHexStringToArray(encryptedValue);

    // use CTR - Counter mode (recommended method)
    const aesCtr = new aes.ModeOfOperation.ctr(keyBytes);
    const textBytes = aesCtr.decrypt(encryptedTextBytes);

    // Convert back the decrypted bytes to the original string
    const text = aes.utils.utf8.fromBytes(textBytes);

    return text;
  }
}