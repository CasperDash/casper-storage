import { IStorage, StorageManager } from "../../src/storage";

class MockStorage implements IStorage {
  data: Map<string, string> = new Map<string, string>();

  set(key: string, value: string): Promise<void> {
    this.data.set(key, "mock_" + value);
    return Promise.resolve();
  }

  get(key: string): Promise<string> {
    return Promise.resolve(this.data.get(key));
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

}

test("storage-manager.default", async () => {
  const storage = StorageManager.getInstance();
  expect(storage).not.toBeFalsy();
})

test("storage-manager.get", async () => {
  const storage = StorageManager.getInstance();
  expect(await storage.get("key")).toBeNull();
})

test("storage-manager.set", async () => {
  let storage = StorageManager.getInstance();
  await storage.set("key", "something");

  // Re-get the instance
  storage = StorageManager.getInstance();
  expect(await storage.get("key")).toBe("something");
})

test("storage-manager.register", async () => {

  StorageManager.register(new MockStorage());

  let storage = StorageManager.getInstance();
  await storage.set("key", "something");

  // Re-get the instance
  storage = StorageManager.getInstance();
  expect(await storage.get("key")).toBe("mock_something");
})