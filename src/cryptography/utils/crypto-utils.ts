import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { utf8ToBytes, randomBytes } from "@noble/hashes/utils";
import { pbkdf2, pbkdf2Async } from "@noble/hashes/pbkdf2";
import { blake2b } from "@noble/hashes/blake2b";
import { base58check } from "micro-base";

const base58c = base58check(sha256);

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
  static digestSHA512(data: Uint8Array, key: Uint8Array) {
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
  static hash256(data: Uint8Array): Uint8Array {
    return sha256(data);
  }

  /**
   * Given a byte array, return the hash160 of the sha256 of the byte array
   * @param {Uint8Array} data - The data to be hashed.
   * @returns The hash160 of the input data.
   */
  static hash160(data: Uint8Array): Uint8Array {
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
   * It encodes the data into a base58 string.
   * @param {Uint8Array} data - The data to be encoded.
   * @returns The base58 encoded string.
   */
  static base58Encode(data: Uint8Array): string {
    return base58c.encode(data);
  }

  /**
   * Convert a string to a Uint8Array
   * @param {string} input - The string to be converted to a byte array.
   * @returns The `convertUt8ToByteArray` function returns a `Uint8Array` object.
   */
  static convertUt8ToByteArray(input: string): Uint8Array {
    return utf8ToBytes(input);
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

}
