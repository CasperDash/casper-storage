import { Password } from "../../../src/cryptography/password";
import { DefaultStorage } from "../../../src/storage/providers/default-storage";

const password  = new Password("Abcd.1234@");
const password2 = new Password("Abcd.1234@22");

class DefaultStorage2 extends DefaultStorage {
  constructor(password: Password) {
    super(password);
  }

  public getKeys(): Promise<string[]> {
    // jsdom provides a wrapper of localStorage with a private map
    // we cannot retrieve keys by Object.keys method
    // try with a loop over indexes instead
    let i = 0;
    const keys = [];
    do {
      const key = this.getStorage().key(i);
      if (key != null) {
        keys.push(key);
      } else {
        break;
      }
      i++;
    } while (true);
    return Promise.resolve(keys);
  }
}

test("default-storage-new", async () => {
  expect(async () => new DefaultStorage2(password)).not.toThrowError();
})

test("default-storage-get-null", async () => {
  const storage = new DefaultStorage2(password);
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-get-and-set", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something")
  expect(await storage.get("key")).toBe("something");
})

test("default-storage-get-and-set-multiple-keys", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");
  await storage.set("key1", "something1");

  expect(await storage.get("key")).toBe("something");
  expect(await storage.get("key1")).toBe("something1");
})

test("default-storage-get-and-set-remove", async () => {
  const storage = new DefaultStorage2(password);

  await storage.set("key", "something");
  expect(await storage.get("key")).toBe("something");

  await storage.remove("key");
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-get-and-set-clear", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");
  expect(await storage.get("key")).toBe("something");
  
  await storage.clear();
  expect(await storage.get("key")).toBeNull();
})

test("default-storage-has-false", async () => {
  const storage = new DefaultStorage2(password);
  expect(await storage.has("key")).toBe(false);
  expect(await storage.has("key2")).toBe(false);
})

test("default-storage-has-true", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");
  expect(await storage.has("key")).toBe(true);

  await storage.set("key2", "something");
  expect(await storage.has("key2")).toBe(true);
})

test("default-storage-has-mixed", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");

  expect(await storage.has("key")).toBe(true);
  expect(await storage.has("key1")).toBe(false);
})

test("default-storage-get-keys-empty", async () => {
  const storage = new DefaultStorage2(password);
  await storage.clear();

  const keys = await storage.getKeys();
  expect(keys.length).toBe(0);
})

test("default-storage-get-keys-expected", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");
  await storage.set("anotherKey", "something");

  expect(await storage.get("key")).toBe("something");
  expect(await storage.get("anotherKey")).toBe("something");

  const keys = await storage.getKeys();
  expect(keys.indexOf("key")).toBeGreaterThanOrEqual(0);
  expect(keys.indexOf("anotherKey")).toBeGreaterThanOrEqual(0);
})

test("default-storage-update-password-no_keys", async () => {
  const storage = new DefaultStorage2(password);
  await storage.clear();

  await storage.updatePassword(password2);
  expect((await storage.getKeys()).length).toBe(0);

  await storage.set("key", "testvalue");
  const testValue = await storage.get("key", password2);
  expect(testValue).toBe("testvalue");
})

test("default-storage-update-password-keys", async () => {
  const storage = new DefaultStorage2(password);
  await storage.set("key", "something");
  await storage.set("anotherKey", "something2");

  await storage.updatePassword(password2);
  expect(await storage.get("key")).toBe("something");
  expect(await storage.get("anotherKey")).toBe("something2");
})