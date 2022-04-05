import { EncryptionType } from "../../../src/cryptography/core";
import { LegacyWallet } from "../../../src/wallet/legacywallet/legacy-wallet";

const PRIVATE_KEY_TEST_01 = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PUBLIC_KEY_TEST_01  = "041da081d7ec39e20755a088c1c90987a496dd1062cda70771657f1103c77670";

test(("legacy-wallet.Ed25519.ctor"), async () => {
  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  expect(wallet.getEncryptionType()).toBe(EncryptionType.Ed25519);
  expect(wallet.getPrivateKey()).toBe(PRIVATE_KEY_TEST_01);
});

test(("legacy-wallet.Ed25519.publicKey"), async () => {
  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  expect(await wallet.getPublicKey()).toBe(PUBLIC_KEY_TEST_01);
});