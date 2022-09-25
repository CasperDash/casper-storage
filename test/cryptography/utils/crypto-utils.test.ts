import { CryptoUtils } from "../../../src/cryptography";

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
