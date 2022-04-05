import { Hex } from "../../utils";

/**
 * Key provider
 */
export interface IKeyManager {
  /**
   * Generate a new key
   * @param wordsLength number of words (default is 24), the words length should be from 12 to 24
   */
  generate(wordsLength?: number): string;

  /**
   * Validate the given key
   * @param key 
   */
  validate(key: string): boolean;

  /**
   * Convert the readable key to entropy value
   * @param key 
   */
  toEntropy(key: string): Uint8Array;

  /**
   * Convert the readable key to entropy value async
   * @param key 
   */
  toEntropyAsync(key: string): Promise<Uint8Array>;

  /**
   * Convert the entropy value to readable key
   * @param entropy
   */
  toKey(entropy: Hex): string;

  /**
   * Convert the entropy value to readable key async
   * @param entropy
   */
  toKeyAsync(entropy: Hex): Promise<string>;

  /**
   * Convert the key to heximal seed
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeed(key: string, password?: string): string;

  /**
   * Convert the key to heximal seed async
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeedAsync(key: string, password?: string): Promise<string>;

  /**
   * Convert the key to Uint8Array array seed
   * @param key 
   * @param password optional password to protect seed key
   */
  toSeedArray(key: string, password?: string): Uint8Array;

  /**
    * Convert the key to Uint8Array array seed async
    * @param key 
    * @param password optional password to protect seed key
    */
  toSeedArrayAsync(key: string, password?: string): Promise<Uint8Array>;
}