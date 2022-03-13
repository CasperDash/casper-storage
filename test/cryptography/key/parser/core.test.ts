import { EncryptionType, KeyValue } from "@/cryptography"
import { TypeUtils } from "@/utils";

test("KeyValue.construct.invalid-key", () => {
  expect(() => new KeyValue(null, EncryptionType.Ed25519)).toThrow("Key is required");
})

test("KeyValue.construct.invalid-encryptionType", () => {
  expect(() => new KeyValue(TypeUtils.parseHexToArray("102f01"), null)).toThrow("Encryption type is required");
})

test("KeyValue.construct.ok-Ed25519", () => {
  const keyValue = new KeyValue(TypeUtils.parseHexToArray("102f01"), EncryptionType.Ed25519);
  expect(TypeUtils.convertArrayToHexString(keyValue.key)).toBe("102f01");
  expect(keyValue.encryptionType).toBe(EncryptionType.Ed25519);
})

test("KeyValue.construct.ok-Secp256k1", () => {
  const keyValue = new KeyValue(TypeUtils.parseHexToArray("102f01"), EncryptionType.Secp256k1);
  expect(TypeUtils.convertArrayToHexString(keyValue.key)).toBe("102f01");
  expect(keyValue.encryptionType).toBe(EncryptionType.Secp256k1);
})