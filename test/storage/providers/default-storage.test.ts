import { DefaultStorage } from "@/storage/providers/default-storage";

test("default-storage-new", async () => {
  expect(async () => new DefaultStorage()).not.toThrowError();
})

test("default-storage-get-null", async () => {
  const storage = new DefaultStorage();
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-get-and-set", async () => {
  const storage = new DefaultStorage();
  await storage.set("key", "something")
  expect(await storage.get("key")).toBe("something");
})

test("default-storage-get-and-set-multiple-keys", async () => {
  const storage = new DefaultStorage();
  await storage.set("key", "something");
  await storage.set("key1", "something1");
  await storage.set("key2", "something2");

  expect(await storage.get("key")).toBe("something");
  expect(await storage.get("key1")).toBe("something1");
  expect(await storage.get("key2")).toBe("something2");
})

test("default-storage-get-and-set-remove", async () => {
  const storage = new DefaultStorage();

  await storage.set("key", "something");
  expect(await storage.get("key")).toBe("something");

  await storage.remove("key");
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-get-and-set-clear", async () => {
  const storage = new DefaultStorage();
  await storage.set("key", "something");
  expect(await storage.get("key")).toBe("something");
  
  await storage.clear();
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-has-false", async () => {
  const storage = new DefaultStorage();
  expect(await storage.has("key")).toBe(false);
  expect(await storage.has("key2")).toBe(false);
})

test("default-storage-has-true", async () => {
  const storage = new DefaultStorage();
  await storage.set("key", "something");
  expect(await storage.has("key")).toBe(true);

  await storage.set("key2", "something");
  expect(await storage.has("key2")).toBe(true);
})

test("default-storage-has-mixed", async () => {
  const storage = new DefaultStorage();
  await storage.set("key", "something");

  expect(await storage.has("key")).toBe(true);
  expect(await storage.has("key1")).toBe(false);
})