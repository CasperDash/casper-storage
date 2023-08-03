import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { utils as baseUtils } from '@scure/base';
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { bytes as assertBytes } from '@noble/hashes/_assert';
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

function calcChecksum(entropy: Uint8Array) {
  // Checksum is ent.length/4 bits long
  const bitsLeft = 8 - entropy.length / 4;
  // Zero rightmost "bitsLeft" bits in byte
  // For example: bitsLeft=4 val=10111101 -> 10110000
  return new Uint8Array([(sha256(entropy)[0]! >> bitsLeft) << bitsLeft]);
}

function getCoder(wordlist: string[]) {
  if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== 'string')
    throw new Error('Worlist: expected array of 2048 strings');
  wordlist.forEach((i) => {
    if (typeof i !== 'string') throw new Error(`Wordlist: non-string element: ${i}`);
  });
  return baseUtils.chain(
    baseUtils.checksum(1, calcChecksum),
    baseUtils.radix2(11, true),
    baseUtils.alphabet(wordlist)
  );
}

function assertEntropy(entropy: Uint8Array) {
  assertBytes(entropy, 16, 20, 24, 28, 32);
}

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

  validate(key: string[], encoded = false): boolean {
    return bip39.validateMnemonic(this.parseKeyTokey(key, encoded), this.getWordList());
  }

  toEntropy(key: string[], encoded = false): Uint8Array {
    return bip39.mnemonicToEntropy(this.parseKeyTokey(key, encoded), this.getWordList());
  }

  toEntropyAsync(key: string[], encoded = false): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toEntropy(key, encoded));
    })
  }

  toKey(entropy: Hex, encode = false): string[] {
    const entropyArr = TypeUtils.parseHexToArray(entropy);
    assertEntropy(entropyArr);

    const words = getCoder(wordlist).encode(entropyArr);
    if (encode) {
      const encodedWords = words.map(x => this.encode(x));
      TypeUtils.clearArray(words);
      return encodedWords;
    }
    return words;
  }

  toKeyAsync(entropy: Hex, encode = false): Promise<string[]> {
    return new Promise((resolve) => {
      resolve(this.toKey(entropy, encode));
    });
  }

  toSeed(entropy: Uint8Array, password?: string): string {
    return TypeUtils.convertArrayToHexString(this.toSeedArray(entropy, password));
  }

  toSeedAsync(entropy: Uint8Array, password?: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toSeed(entropy, password));
    });
  }

  toSeedArray(entropy: Uint8Array, password?: string): Uint8Array {
    const words = this.toKey(entropy);
    const normalizedWords = words.map(x => x.normalize("NFKD"));
    TypeUtils.clearArray(words);
    
    let bytes = EncoderUtils.encodeText(normalizedWords[0]);
    const spaceBytes = EncoderUtils.encodeText(" ");
    for (let i = 1; i < normalizedWords.length; i++) {
      bytes = TypeUtils.concatBytes(bytes, spaceBytes, EncoderUtils.encodeText(normalizedWords[i]));
    }

    TypeUtils.clearArray(normalizedWords);

    return pbkdf2(sha512, bytes, `mnemonic${password || ""}`.normalize("NFKD"), { c: 2048, dkLen: 64 });
  }

  toSeedArrayAsync(entropy: Uint8Array, password?: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toSeedArray(entropy, password));
    });
  }

  private parseKeyTokey(key: string[], encoded = false): string {
    if (encoded) {
      return key.map(x => this.decode(x)).join(" ");
    } else {
      return key.join(" ");
    }
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
