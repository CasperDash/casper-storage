import { Hex } from "../../utils";

/**
 * Key provider
 */
export interface IKeyManager {
  /**
   * Generate a new key (entropy of phrase)
   * @param wordsLength number of words (default is 24), the words length should be from 12 to 24
   */
  generate(wordsLength?: number): Uint8Array;

  /**
   * Validate the given key
   * @param key 
   * @param encoded indicates that each word in key is encoded
   */
  validate(key: string[], encoded?: boolean): boolean;

  /**
   * Convert the readable key to entropy value
   * @param key 
   */
  toEntropy(key: string[], encoded?: boolean): Uint8Array;

  /**
   * Convert the readable key to entropy value async
   * @param key 
   */
  toEntropyAsync(key: string[], encoded?: boolean): Promise<Uint8Array>;

  /**
   * Convert the entropy value to readable key
   * @param entropy
   * @param encode to encode each word of key
   */
  toKey(entropy: Hex, encode?: boolean): string[];

  /**
   * Convert the entropy value to readable key async
   * @param entropy
   * @param encode to encode each word of key
   */
  toKeyAsync(entropy: Hex, encode?: boolean): Promise<string[]>;

  /**
   * Get a word at a specific index of the given entropy.
   * If the index is not available, undefined will be returned
   * @param entropy 
   * @param index 
   * @param encode
   */
  getWordAt(entropy: Hex, index: number, encode: boolean): string;

  /**
   * Convert the entropy of key to heximal seed
   * @param entropy 
   * @param password optional password to protect seed key
   */
  toSeed(entropy: Uint8Array, password?: string): string;

  /**
   * Convert the entropy of key to heximal seed async
   * @param entropy 
   * @param password optional password to protect seed key
   */
  toSeedAsync(entropy: Uint8Array, password?: string): Promise<string>;

  /**
   * Convert the entropy of key to Uint8Array array seed
   * @param entropy 
   * @param password optional password to protect seed key
   */
  toSeedArray(entropy: Uint8Array, password?: string): Uint8Array;

  /**
    * Convert the entropy of key to Uint8Array array seed async
    * @param entropy
    * @param password optional password to protect seed key
    */
  toSeedArrayAsync(entropy: Uint8Array, password?: string): Promise<Uint8Array>;
}