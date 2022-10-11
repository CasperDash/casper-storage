import { CryptoUtils } from "../../../src/cryptography";

test("crypto-utils.pbkdf2Sync.ensure-min-salt-length_invalid", () => {
  expect(() => CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(15), 120000, 16)).toThrowError("Salt must be provided with minimum of 16 bytes");
})

test("crypto-utils.pbkdf2Sync.ensure-min-salt-length_ok", () => {
  expect(CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(16), 120000, 16).length).toBe(16);
})

test("crypto-utils.pbkdf2Sync-ensure-min-iterations-invalid", () => {
  expect(() => CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(16), 120000-1, 16)).toThrowError("Iterations for PBKDF2-HMAC-SHA5121 should be from 120000");
})

test("crypto-utils.pbkdf2Sync-ensure-min-iterations-ok", () => {
  expect(CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(16), 120000, 16).length).toBe(16);
})

test("crypto-utils.pbkdf2Sync-ensure-min-keySize-invalid", () => {
  expect(() => CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(16), 120000, 15)).toThrowError("Key size must be from 16");
})

test("crypto-utils.pbkdf2Sync-ensure-min-keySize-ok", () => {
  expect(CryptoUtils.pbkdf2Sync(CryptoUtils.randomBytes(16), CryptoUtils.randomBytes(16), 120000, 16).length).toBe(16);
})

test("crypto-utils.scrypt-invalid-put-null", () => {
  expect(() => CryptoUtils.scrypt(null, null)).toThrowError("Input is required");
})

test("crypto-utils.scrypt-invalid-put-empty", () => {
  expect(() => CryptoUtils.scrypt("", null)).toThrowError("Input is required");
})

test("crypto-utils.scrypt-invalid-put-salt", () => {
  expect(() => CryptoUtils.scrypt("Test", null)).toThrowError("Salt is required");
})

test("crypto-utils.scrypt-invalid-put-short", () => {
  const pk = CryptoUtils.scrypt("a", CryptoUtils.randomBytes(16));
  expect(pk.length).toBe(32);
})

test("crypto-utils.scrypt-invalid-put-short-2", () => {
  const pk = CryptoUtils.scrypt("ThisIsAWeekPwd", CryptoUtils.randomBytes(16));
  expect(pk.length).toBe(32);
})
