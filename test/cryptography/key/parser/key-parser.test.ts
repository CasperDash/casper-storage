import { EncryptionType, KeyParser } from "@/cryptography";

test("key-parser.getInstance.auto", () => {
  expect(KeyParser.getInstance()).not.toBeFalsy();
})

test("key-parser.getInstance.Ed25519", () => {
  expect(KeyParser.getInstance(EncryptionType.Ed25519)).not.toBeFalsy();
})

test("key-parser.getInstance.Secp256k1", () => {
  expect(KeyParser.getInstance(EncryptionType.Secp256k1)).not.toBeFalsy();
})

test("key-parser.getInstance.Secp256k1", () => {
  expect(KeyParser.getInstance(EncryptionType.Secp256k1)).not.toBeFalsy();
})