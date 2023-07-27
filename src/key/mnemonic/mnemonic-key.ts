import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { CryptoUtils, EncoderUtils } from '../../cryptography';
import { IKeyManager } from "../../key/core";
import { Hex, TypeUtils } from "../../utils";

/**
 * Available options
 * https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 */
const WORDS_LENGTH_STRENGTH_MAP = new Map<number, number>([
  [12, 128],
  [15, 160],
  [18, 192],
  [21, 224],
  [24, 256]
]);

/**
 * Let's use the longest available length
 */
const DEFAULT_WORDS_LENGTH = 24;

/**
 * Wrapper to work with mnemonic
 */
export class MnemonicKey implements IKeyManager {

  generate(wordsLength?: number): Uint8Array {
    if (wordsLength == null) {
      wordsLength = DEFAULT_WORDS_LENGTH;
    }
    if (!WORDS_LENGTH_STRENGTH_MAP.has(wordsLength)) {
      throw new Error(`Length of words must be in allowed list: ${Array.from(WORDS_LENGTH_STRENGTH_MAP.keys()).join(", ")}`)
    }

    const byteLength = WORDS_LENGTH_STRENGTH_MAP.get(wordsLength);
    return CryptoUtils.randomBytes(byteLength / 8);
  }

  validate(key: string | string[], encoded = false): boolean {
    return bip39.validateMnemonic(this.parseKeyTokey(key, encoded), this.getWordList());
  }

  toEntropy(key: string | string[], encoded = false): Uint8Array {
    return bip39.mnemonicToEntropy(this.parseKeyTokey(key, encoded), this.getWordList());
  }

  toEntropyAsync(key: string | string[], encoded = false): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toEntropy(key, encoded));
    })
  }

  toKey(entropy: Hex, encode = false): string[] {
    const entropyArray = TypeUtils.parseHexToArray(entropy);
    const key = bip39.entropyToMnemonic(entropyArray, this.getWordList());
    if (encode) {
      return key.split(" ").map(x => this.encode(x));
    } else {
      return key.split(" ");
    }
  }

  toKeyAsync(entropy: Hex, encode = false): Promise<string[]> {
    return new Promise((resolve) => {
      resolve(this.toKey(entropy, encode));
    });
  }

  toSeed(key: string | Hex, password?: string): string {
    const arr = bip39.mnemonicToSeedSync(this.parseEntrophyOrKeyToKey(key), password);
    return TypeUtils.convertArrayToHexString(arr);
  }

  toSeedAsync(key: string | Hex, password?: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toSeed(key, password));
    });
  }

  toSeedArray(key: string | Hex, password?: string): Uint8Array {
    return bip39.mnemonicToSeedSync(this.parseEntrophyOrKeyToKey(key), password);
  }

  toSeedArrayAsync(key: string | Hex, password?: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toSeedArray(key, password));
    });
  }

  private parseKeyTokey(key: string | string[], encoded = false): string {
    if (key instanceof Array) {
      if (encoded) {
        return key.map(x => this.decode(x)).join(" ");
      } else {
        return key.join(" ");
      }
    } else {
      if (encoded) {
        return key.split(" ").map(x => this.decode(x)).join(" ");
      } else {
        return key;
      }
    }
  }

  private parseEntrophyOrKeyToKey(keyOrEntrophy: string | Hex): string {
    if (keyOrEntrophy instanceof Uint8Array) {
      return this.toKey(keyOrEntrophy).join(" ");
    }
    if (keyOrEntrophy.indexOf(" ") > 0) {
      return keyOrEntrophy;
    }

    // Hex
    return this.toKey(TypeUtils.parseHexToArray(keyOrEntrophy)).join(" ");
  }

  private encode(val: string): string {
    return EncoderUtils.encodeBase64(val);
  }

  private decode(val: string): string {
    return EncoderUtils.decodeBase64(val);
  }

  /**
   * Returns the default wordlist
   * @returns 
   */
  private getWordList() {
    return wordlist;
  }

}
