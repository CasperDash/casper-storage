import { StorageManager } from "@/storage";

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