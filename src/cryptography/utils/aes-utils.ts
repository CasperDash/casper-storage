import { TypeUtils } from "../../utils";
import { CryptoUtils } from ".";

import { NativeModules } from "react-native";

const Aes = NativeModules.Aes;
const aesMode = "aes-256-gcm";

const generateKey = (password: string, salt: string, cost: number = 5000, length: number = 256) => Aes.pbkdf2(password, salt, cost, length);

const encrypt = async (password: string, text: string, iv: string): Promise<string> => {
  const keyBytes = await generateKey(password, iv);
  const cipher = await Aes.encrypt(text, keyBytes, iv, aesMode);
  return cipher;
};

const decrypt = async (password: string, cipher: string, iv: string): Promise<string> => {
  const keyBytes = await generateKey(password, iv);
  const text = await Aes.decrypt(cipher, keyBytes, iv, aesMode);
  return text;
};

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
  static async encrypt(password: string, value: string, iv: Uint8Array = null, mode = aesMode): Promise<EncryptionResult> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!mode) throw new Error("Encrypt mode is required")

    iv = iv || CryptoUtils.randomBytes(16);

    const cipher = await encrypt(password, value, TypeUtils.parseHexToString(iv));
    return new EncryptionResult(cipher, iv);
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
  static async decrypt(password: string, value: string, iv: Uint8Array, mode = aesMode): Promise<string> {
    if (!password) throw new Error("Key is required")
    if (!value) throw new Error("Value is required")
    if (!iv) throw new Error("IV is required")
    if (!mode) throw new Error("Encrypt mode is required")

    const decryptedText = await decrypt(password, value, TypeUtils.parseHexToString(iv));
    return decryptedText;
  }
}
