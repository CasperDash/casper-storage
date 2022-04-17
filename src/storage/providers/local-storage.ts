import { IStorage } from "../interfaces";

/**
 * Simple wrapper for localStorage of browser
 */
export class LocalStorage implements IStorage {

  async set(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
  }

  async get(key: string): Promise<string> {
    return Promise.resolve(window.localStorage.getItem(key));
  }

  async has(key: string): Promise<boolean> {
    return Promise.resolve(window.localStorage.getItem(key) != null);
  }

  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    window.localStorage.clear();
  }

  public isAvailable(): boolean {
    try {
      window.localStorage.getItem("test");
      return true;
    } catch (_) {
      return false;
    }
  }

}
