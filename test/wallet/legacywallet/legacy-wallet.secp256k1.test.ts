import { EncryptionType } from "../../../src/cryptography/core";
import { LegacyWallet } from "../../../src/wallet/legacywallet/legacy-wallet";

const PRIVATE_KEY_TEST_01 = "5b608b9052d04bae771428ec6e09b4d8d30d9b57f64bf2923710d9d08ba78936";
const PUBLIC_KEY_TEST_01  = "031b307f764b408adc049f9b390073962673afe95e2e670a9c534c60ca5f933d32";

test(("legacy-wallet.Secp256k1.ctor"), async () => {
  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(wallet.getEncryptionType()).toBe(EncryptionType.Secp256k1);
  expect(wallet.getPrivateKey()).toBe(PRIVATE_KEY_TEST_01);
});

test(("legacy-wallet.Secp256k1.publicKey"), async () => {
  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(await wallet.getRawPublicKey()).toBe(PUBLIC_KEY_TEST_01);
});