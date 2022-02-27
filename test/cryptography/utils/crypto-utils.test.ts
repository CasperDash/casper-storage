import { CryptoUtils } from "@/cryptography";

test("crypto-utils.scrypt-invalid-put-null", () => {
  expect(() => CryptoUtils.scrypt(null)).toThrowError("Input is required");
})

test("crypto-utils.scrypt-invalid-put-empty", () => {
  expect(() => CryptoUtils.scrypt("")).toThrowError("Input is required");
})

test("crypto-utils.scrypt-invalid-put-short", () => {
  const pk = CryptoUtils.scrypt("a");
  expect(pk.length).toBe(32);
})

test("crypto-utils.scrypt-invalid-put-short-2", () => {
  const pk = CryptoUtils.scrypt("ThisIsAWeekPwd");
  expect(pk.length).toBe(32);
})
