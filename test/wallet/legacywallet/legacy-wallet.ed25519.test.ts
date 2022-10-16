import { EncryptionType } from "../../../src/cryptography/core";
import { LegacyWallet } from "../../../src/wallet/legacywallet/legacy-wallet";

const PRIVATE_KEY_TEST_01 = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PUBLIC_KEY_TEST_01  = "041da081d7ec39e20755a088c1c90987a496dd1062cda70771657f1103c77670";
const PRIVATE_KEY_PEM_TEST_01 = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDB2V0tM9GCF/5yIeiH2vKLm7BYvegpytGccLXcNoBSm
-----END PRIVATE KEY-----`;

const wallet01 = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);

test(("legacy-wallet.Ed25519.ctor"), async () => {
  expect(wallet01.getEncryptionType()).toBe(EncryptionType.Ed25519);
  expect(wallet01.getPrivateKey()).toBe(PRIVATE_KEY_TEST_01);
});

test(("legacy-wallet.Ed25519.publicKey"), async () => {
  expect(await wallet01.getRawPublicKey()).toBe(PUBLIC_KEY_TEST_01);
});

test(("legacy-wallet.Ed25519.private-PEM"), async () => {
  expect(wallet01.getPrivateKeyInPEM()).toBe(PRIVATE_KEY_PEM_TEST_01);
});
