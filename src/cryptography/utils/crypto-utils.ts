import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { randomBytes } from "@noble/hashes/utils";
import { pbkdf2, pbkdf2Async } from "@noble/hashes/pbkdf2";
import { blake2b } from "@noble/hashes/blake2b";
import { scrypt } from '@noble/hashes/scrypt';
import { Hex, TypeUtils } from "@/utils";

/**
 * Provide utilities to due with cryptography
 */
export class CryptoUtils {

 /**
  * It uses the HMAC function to generate a key and chain code.
  * @param {Uint8Array} data - The data to be hashed.
  * @param {Uint8Array} key - The private key.
  * @returns an object with two properties: `key` and `chainCode`.
  */
  static digestSHA512(data: Hex, key: Hex) {
    if (!data) {
      throw new Error("Data is required");
    }
    if (!key) {
      throw new Error("Key is required");
    }

    // Ensure to have the valid byte-array
    data = TypeUtils.parseHexToArray(data);
    key = TypeUtils.parseHexToArray(key);

    const I = hmac(sha512, key, data);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
      key: IL,
      chainCode: IR
    }
  }

  /**
   * It hashes the data using the SHA-256 algorithm.
   * @param {Uint8Array} data - The data to be hashed.
   * @returns The hash256 function returns a hash256 value.
   */
  static hash256(data: Hex): Uint8Array {
    if (!data) {
      throw new Error("Data is required");
    }

    // Ensure to have the valid byte-array
    data = TypeUtils.parseHexToArray(data);

    return sha256(data);
  }

  /**
   * Given a byte array, return the hash160 of the sha256 of the byte array
   * @param {Uint8Array} data - The data to be hashed.
   * @returns The hash160 of the input data.
   */
  static hash160(data: Hex): Uint8Array {
    if (!data) {
      throw new Error("Data is required");
    }

    // Ensure to have the valid byte-array
    data = TypeUtils.parseHexToArray(data);

    return ripemd160(sha256(data));
  }

  /**
   * It hashes the password using the PBKDF2 algorithm.
   * @param {Uint8Array} password - The password to use for the key derivation.
   * @param {Uint8Array} salt - A salt to use for the key derivation function.
   * @param {number} iterations - The number of iterations to perform.
   * @param {number} keySize - The size of the derived key in bytes.
   * @returns The PBKDF2 function returns a Uint8Array.
   */
  static pbkdf2Sync(password: Uint8Array, salt: Uint8Array, iterations: number, keySize: number): Uint8Array {
    return pbkdf2(sha512, password, salt, { c: iterations, dkLen: keySize });
  }

  /**
   * It uses the SHA-512 hash function to generate a key from the password and salt.
   * @param {Uint8Array} password - The password to use for the key derivation.
   * @param {Uint8Array} salt - A salt to use for the key derivation function.
   * @param {number} iterations - The number of iterations to perform.
   * @param {number} keySize - The size of the derived key in bytes.
   * @returns The PBKDF2 function returns a Promise that resolves to a Uint8Array containing the
   * derived key.
   */
  static pbkdf2(password: Uint8Array, salt: Uint8Array, iterations: number, keySize: number): Promise<Uint8Array> {
    return pbkdf2Async(sha512, password, salt, { c: iterations, dkLen: keySize });
  }

  /**
   * Generate a random array of bytes of the given length
   * @param {number} len - the length of the random bytes to generate.
   * @returns A random Uint8Array of length `len`.
   */
  static randomBytes(len: number): Uint8Array {
    return randomBytes(len);
  }

  /**
   * It hashes the input using the blake2b algorithm.
   * @param {Uint8Array} x - The input to the hash function.
   * @param [length=32] - The length of the output hash in bytes.
   * @returns The hash of the input.
   */
  static blake2bHash(x: Uint8Array, length = 32): Uint8Array {
    return blake2b(x, {
      dkLen: length
    });
  }

  /**
   * Create a strong private key from any input, where the key is longer and more secure.
   * @param input 
   * @returns 
   */
  static scrypt(input: string): Uint8Array {
    if (!input) {
      throw new Error("Input is required");
    }
    return scrypt(input, 'salt', { N: 2 ** 16, r: 8, p: 1, dkLen: 32 });
  }
}
