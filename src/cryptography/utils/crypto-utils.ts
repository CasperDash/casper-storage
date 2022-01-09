import CryptoJS from "crypto-js";
import { sha256 } from "@noble/hashes/sha256";
import { base58check } from "micro-base";
import { TypeUtils, Hex } from "@/utils";

const base58c = base58check(sha256);

export class CryptoUtils {

  static digestData(data: Uint8Array, key: Uint8Array) {
    const value = CryptoJS.HmacSHA512(CryptoJSUtils.convertUint8ArrayToWordArray(data), CryptoJSUtils.convertUint8ArrayToWordArray(key));
    const I = CryptoJSUtils.convertWordArrayToUint8Array(value);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
      key: IL,
      chainCode: IR
    }
  }

  static hash256(data: Uint8Array): Uint8Array {
    const value = CryptoJS.SHA256(CryptoJSUtils.convertUint8ArrayToWordArray(data));
    return CryptoJSUtils.convertWordArrayToUint8Array(value);
  }

  static hash160(data: Uint8Array): Uint8Array {
    const dataWords = CryptoJSUtils.convertUint8ArrayToWordArray(data);
    const value = CryptoJS.RIPEMD160(CryptoJS.SHA256(dataWords));
    return CryptoJSUtils.convertWordArrayToUint8Array(value);
  }

  static pbkdf2Sync(password: Uint8Array, salt: Uint8Array, iterations: number, keySize: number, digest: string): Uint8Array {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hasher: any;
    if (digest) {
      switch (digest.toLocaleLowerCase()) {
        case "sha256": hasher = CryptoJS.algo.SHA256; break;
        case "sha512": hasher = CryptoJS.algo.SHA512; break;
      }
    }
    const value = CryptoJS.PBKDF2(
      CryptoJSUtils.convertUint8ArrayToWordArray(password),
      CryptoJSUtils.convertUint8ArrayToWordArray(salt), {
        iterations: iterations,
        keySize: keySize,
        hasher: hasher
    });
    return CryptoJSUtils.convertWordArrayToUint8Array(value);
  }

  static pbkdf2(password: Uint8Array, salt: Uint8Array, iterations: number, keySize: number, digest: string): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      resolve(CryptoUtils.pbkdf2Sync(password, salt, iterations, keySize, digest));
    });
  }

  static parseToArray(input: Hex): Uint8Array {
    if (TypeUtils.isString(input)) {
      return TypeUtils.convertHexStringToArray(input as string);
    }
    return input as Uint8Array;
  }

  static randomBytes(len: number): Uint8Array {
    return CryptoJSUtils.convertWordArrayToUint8Array(CryptoJS.lib.WordArray.random(len));
  }

  static base58Encode(data: Uint8Array) {
    return base58c.encode(data);
  }
}

class CryptoJSUtils {
  static convertWordArrayToUint8Array(wordArr: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArr.words;
    const sigBytes = wordArr.sigBytes;

    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }

    return u8;
  }

  static convertUint8ArrayToWordArray(arr: Uint8Array): CryptoJS.lib.WordArray {
    const len = arr.length;

    const words = [];
    for (let i = 0; i < len; i++) {
      words[i >>> 2] |= (arr[i] & 0xff) << (24 - (i % 4) * 8);
    }

    return CryptoJS.lib.WordArray.create(words, len);
  }
}