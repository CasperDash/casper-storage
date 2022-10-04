import { Password } from "../../src/cryptography/password";
import { IStorage, StorageManager } from "../../src/storage";

const password = new Password("Abcd.1234@");
const data: Map<string, string> = new Map<string, string>();

class MockStorage implements IStorage {

  constructor(_: Password) {
    // This is intentional
  }

  set(key: string, value: string): Promise<void> {
    data.set(key, "mock_" + value);
    return Promise.resolve();
  }

  get(key: string): Promise<string> {
    return Promise.resolve(data.get(key));
  }

  has(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  remove(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  clear(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getKeys(): Promise<string[]> {
    return Promise.resolve(Array.from(data.keys()));
  }

  updatePassword(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  isAvailable(): boolean {
    return true;
  }
}

test("storage-manager.default", async () => {
  const storage = StorageManager.getInstance(password);
  expect(storage).not.toBeFalsy();
})

test("storage-manager.get", async () => {
  const storage = StorageManager.getInstance(password);
  expect(await storage.get("key")).toBeNull();
})

test("storage-manager.set", async () => {
  let storage = StorageManager.getInstance(password);
  await storage.set("key", "something");

  // Re-get the instance
  storage = StorageManager.getInstance(password);
  expect(await storage.get("key")).toBe("something");
})

test("storage-manager.register", async () => {
  StorageManager.register(MockStorage);

  let storage = StorageManager.getInstance(password);
  await storage.set("key", "something");

  // Re-get the instance
  storage = StorageManager.getInstance(password);
  expect(await storage.get("key")).toBe("mock_something");
})