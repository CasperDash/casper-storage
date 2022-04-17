/**
 * Define a storage manager
 */
export interface IStorage {

  /**
   * Set a key-value pair to storage
   * @param key 
   * @param value 
   */
  set(key: string, value: string): Promise<void>;

  /**
   * Get the value of a key.
   * Returns `null` if the key is not available in storage
   * @param key 
   */
  get(key: string): Promise<string>;

  /**
   * Check if a key exists in storage
   * @param key 
   */
  has(key: string): Promise<boolean>;

  /**
   * Remove a key out of storage.
   * @param key 
   */
  remove(key: string): Promise<void>;

  /**
   * Clear all stored key-value pairs
   */
  clear(): Promise<void>;

  /**
   * Check whether the storage is available to use
   */
  isAvailable(): boolean;

}