import * as bip39 from "@/bips/bip39";
import { IKeyManager } from "@/key/core";
import { Hex, TypeUtils } from "@/utils";


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
const DEFAULT_WORDS_LENGTH = 12;

/**
 * Wrapper to work with mnemonic
 */
export class MnemonicKey implements IKeyManager {

  generate(wordsLength?: number): string {
    if (wordsLength == null) {
      wordsLength = DEFAULT_WORDS_LENGTH;
    }
    if (!WORDS_LENGTH_STRENGTH_MAP.has(wordsLength)) {
      throw new Error(`Length of words must be in allowed list: ${Array.from(WORDS_LENGTH_STRENGTH_MAP.keys()).join(", ")}`)
    }
    return bip39.generateMnemonic(WORDS_LENGTH_STRENGTH_MAP.get(wordsLength));
  }

  validate(key: string): boolean {
    return bip39.validateMnemonic(key);
  }

  toEntropy(key: string): string {
    return bip39.mnemonicToEntropy(key);
  }

  toEntropyAsync(key: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toEntropy(key));
    })
  }

  toKey(entropy: Hex): string {
    const key = bip39.entropyToMnemonic(entropy);
    return key;
  }

  toKeyAsync(entropy: Hex): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toKey(entropy));
    });
  }

  toSeed(key: string, password?: string): string {
    const arr = bip39.mnemonicToSeedSync(key, password);
    return TypeUtils.convertArrayToHexString(arr);
  }

  toSeedAsync(key: string, password?: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toSeed(key, password));
    });
  }

  toSeedArray(key: string, password?: string): Uint8Array {
    return bip39.mnemonicToSeedSync(key, password);
  }

  toSeedArrayAsync(key: string, password?: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toSeedArray(key, password));
    });
  }

}
