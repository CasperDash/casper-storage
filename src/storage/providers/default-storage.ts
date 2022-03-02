import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorage } from "../interfaces";

/**
 * Default storage, which is a wrapper of AsyncStorage
 * Supports Web, iOS, Android, etc
 */
export class DefaultStorage implements IStorage {

  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async get(key: string): Promise<string> {
    return await AsyncStorage.getItem(key);
  }

  async has(key: string): Promise<boolean> {
    const keys = await AsyncStorage.getAllKeys();
    return keys && keys.indexOf(key) >= 0;
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }

}