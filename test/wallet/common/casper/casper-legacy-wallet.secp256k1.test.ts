import { EncryptionType } from "../../../../src/cryptography/core";
import { CasperLegacyWallet } from "../../../../src/wallet/common/casper";

// Convert PEM to hex
// openssl ec -in key.pem -text -noout

const PRIVATE_KEY_TEST_01    = "06dc1d7d051969d411e966c6c02d3d025b586f6c1a9c5688efa168b5919708f4";
const PUBLIC_KEY_TEST_01     = "027b8db8cf675252c61e3de6932b3ac790ba39f1e99275aa2d3f05496767fe37cf";
const PUBLIC_ADDRESS_TEST_01 = "02027b8db8cf675252c61e3de6932b3ac790ba39f1e99275aa2d3f05496767fe37cf";
const PUBLIC_HASH_TEST_01    = "7ba08fc9133f68480e22d41e0049eafe5de60d059f8b962ea91033e6654ae612";

test(("casper-legcy-wallet.secp256k1.ctor"), async () => {
  let wallet = new CasperLegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(wallet.getEncryptionType()).toBe(EncryptionType.Secp256k1);
  expect(wallet.getPrivateKey()).toBe(PRIVATE_KEY_TEST_01);
});

test(("casper-legcy-wallet.secp256k1.publicKey"), async () => {
  let wallet = new CasperLegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(await wallet.getRawPublicKey()).toBe(PUBLIC_KEY_TEST_01);
});

test(("casper-legcy-wallet.secp256k1.publicAddress"), async () => {
  let wallet = new CasperLegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(await wallet.getPublicKey()).toBe(PUBLIC_ADDRESS_TEST_01);
});

test(("casper-legcy-wallet.secp256k1.publicHash"), async () => {
  let wallet = new CasperLegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);
  expect(await wallet.getPublicAddress()).toBe(PUBLIC_HASH_TEST_01);
});