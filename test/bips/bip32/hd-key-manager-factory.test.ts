import { HDKeyManagerFactory } from "@/bips/bip32"
import { EncryptionType } from "@/cryptography";

test("hd-key-manager-factory.getInstance.Ed25519", () => {
  const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Ed25519);
  expect(keyManager.encryptionType).toBe(EncryptionType.Ed25519);
})

test("hd-key-manager-factory.getInstance.Secp256k1", () => {
  const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Secp256k1);
  expect(keyManager.encryptionType).toBe(EncryptionType.Secp256k1);
})