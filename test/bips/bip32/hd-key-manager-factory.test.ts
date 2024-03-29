import { HDKeyManagerFactory } from "../../../src/bips/bip32"
import { EncryptionType } from "../../../src/cryptography";

test("hd-key-manager-factory.getInstance.invalid", () => {
  expect(() => HDKeyManagerFactory.getInstance(null)).toThrow("The encryption type null is not supported");
})

test("hd-key-manager-factory.getInstance.Ed25519", () => {
  const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Ed25519);
  expect(keyManager.encryptionType).toBe(EncryptionType.Ed25519);
})

test("hd-key-manager-factory.getInstance.Secp256k1", () => {
  const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Secp256k1);
  expect(keyManager.encryptionType).toBe(EncryptionType.Secp256k1);
})
