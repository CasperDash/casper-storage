import { Hex } from "../../utils";

/**
 * Key provider
 */
export interface IKeyManager {
  /**
   * Generate a new key (entrophy of phrase)
   * @param wordsLength number of words (default is 24), the words length should be from 12 to 24
   */
  generate(wordsLength?: number): Uint8Array;

  /**
   * Validate the given key
   * @param key 
   * @param encoded indicates that each word in key is encoded
   */
  validate(key: string | string[], encoded?: boolean): boolean;

  /**
   * Convert the readable key to entropy value
   * @param key 
   */
  toEntropy(key: string | string[], encoded?: boolean): Uint8Array;

  /**
   * Convert the readable key to entropy value async
   * @param key 
   */
  toEntropyAsync(key: string | string[], encoded?: boolean): Promise<Uint8Array>;

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
   * Convert the key to heximal seed
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeed(key: string | Hex, password?: string): string;

  /**
   * Convert the key to heximal seed async
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeedAsync(key: string | Hex, password?: string): Promise<string>;

  /**
   * Convert the key to Uint8Array array seed
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeedArray(key: string | Hex, password?: string): Uint8Array;

  /**
    * Convert the key to Uint8Array array seed async
    * @param key
    * @param password optional password to protect seed key
    */
  toSeedArrayAsync(key: string | Hex, password?: string): Promise<Uint8Array>;
}