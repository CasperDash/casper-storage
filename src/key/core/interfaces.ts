import { Hex } from "@/utils";

/**
 * Configuration for key provider to process keys (generation, validation, etc)
 */
export interface IKeyMangerConfig {
  /**
   * The number of words to generate (default to 12)
   */
  WordsLength: number;

  /**
   * The optional password to protect the master key
   */
  Password?: string;
}

/**
 * Key provider
 */
export interface IKeyManager {
  /**
   * Generate a new key
   */
  generate(): string;

  /**
   * Validate the given key
   * @param key 
   */
  validate(key: string): boolean;

  /**
   * Convert the readable key to entropy value
   * @param key 
   */
  toEntropy(key: string): string;

  /**
   * Convert the readable key to entropy value async
   * @param key 
   */
  toEntropyAsync(key: string): Promise<string>;

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