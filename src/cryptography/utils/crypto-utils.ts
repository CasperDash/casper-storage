import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from '@noble/hashes/sha512';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { randomBytes } from 'react-native-randombytes';
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { blake2b } from "@noble/hashes/blake2b";
import { scrypt } from '@noble/hashes/scrypt';
import { crypto } from '@noble/hashes/crypto';
import { Hex, TypeUtils } from "../../utils";

const MIN_ITERATIONS_SHA512 = 120000;
const MIN_SALT_LENGTH_BYTES = 16;
const MIN_KEY_SIZE = 16;

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
   * @param {Uint8Array} salt - A salt to use for the key derivation function (salt's length must be from 16).
   * @param {number} iterations - The number of iterations to perform (must be from 120k).
   * @param {number} keySize - The size of the derived key in bytes (must be from 16).
   * @returns The PBKDF2 function returns a Uint8Array.
   */
  static pbkdf2Sync(password: Uint8Array, salt: Uint8Array, iterations: number, keySize: number): Uint8Array {
    this.ensurePbkdf2Input(salt, iterations, keySize);
    return pbkdf2(sha512, password, salt, { c: iterations, dkLen: keySize });
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
   * @param salt 
   * @returns 
   */
  static scrypt(input: string, salt: Uint8Array): Uint8Array {
    if (!input) throw new Error("Input is required");
    if (!salt) throw new Error("Salt is required");

    return scrypt(input, salt, { N: 2 ** 16, r: 8, p: 1, dkLen: 32 });
  }

  /**
   * Returns the crypto instance which is resolved based on the envrionment
   * @returns 
   */
  static getCrypto(): Crypto {
    if (crypto) {
      return crypto;
    } else {
      throw new Error("The environment doesn't have crypto functions");
    } 
  }

  private static ensurePbkdf2Input(salt: Uint8Array, iterations: number, keySize: number) {
    if (!salt || salt.length < MIN_SALT_LENGTH_BYTES) {
      throw new Error(`Salt must be provided with minimum of ${MIN_SALT_LENGTH_BYTES} bytes`);
    }
    if (!iterations || iterations < MIN_ITERATIONS_SHA512) {
      throw new Error(`Iterations for PBKDF2-HMAC-SHA5121 should be from ${MIN_ITERATIONS_SHA512}`);
    }
    if (!keySize || keySize < MIN_KEY_SIZE) {
      throw new Error(`Key size must be from ${MIN_KEY_SIZE}`);
    }
  }
}
