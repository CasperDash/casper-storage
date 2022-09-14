import { NativeModules } from "react-native";

const Aes = NativeModules.Aes;
const generateKey = (password: string, salt: string, cost: number = 5000, length: number = 256) => Aes.pbkdf2(password, salt, cost, length);
const aesMode = "aes-256-cbc";

const encrypt = async (key: string, text: string) => {
  const keybytes = await generateKey(key, "casper-storage");
  const iv = await Aes.randomKey(16);
  const cipher = await Aes.encrypt(text, keybytes, iv, aesMode);
  const encryptedValue = JSON.stringify({ iv, cipher });
  return encryptedValue;
};

const decrypt = async (key: string, encryptedDataText: string) => {
  const keybytes = await generateKey(key, "casper-storage");
  const encryptedData = JSON.parse(encryptedDataText);
  const decryptedText = await Aes.decrypt(encryptedData.cipher, keybytes, encryptedData.iv, aesMode);
  return decryptedText;
};

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
    return encrypt(key, value);
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
    return decrypt(key, encryptedValue);
  }
}
