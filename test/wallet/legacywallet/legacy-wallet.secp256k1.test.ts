import { EncryptionType } from "../../../src/cryptography/core";
import { LegacyWallet } from "../../../src/wallet/legacywallet/legacy-wallet";

const PRIVATE_KEY_TEST_01 = "06dc1d7d051969d411e966c6c02d3d025b586f6c1a9c5688efa168b5919708f4";
const PUBLIC_KEY_TEST_01  = "027b8db8cf675252c61e3de6932b3ac790ba39f1e99275aa2d3f05496767fe37cf";
const PRIVATE_KEY_PEM_TEST_01 = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIAbcHX0FGWnUEelmxsAtPQJbWG9sGpxWiO+haLWRlwj0oAcGBSuBBAAK
oUQDQgAEe424z2dSUsYePeaTKzrHkLo58emSdaotPwVJZ2f+N8+5Cw8eLpukxpvA
qPD0f41wM+8QJxGj41A1QGLpsckvmA==
-----END EC PRIVATE KEY-----`;

const wallet01 = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Secp256k1);

test(("legacy-wallet.Secp256k1.ctor"), async () => {
  expect(wallet01.getEncryptionType()).toBe(EncryptionType.Secp256k1);
  expect(wallet01.getPrivateKey()).toBe(PRIVATE_KEY_TEST_01);
});

test(("legacy-wallet.Secp256k1.publicKey"), async () => {
  expect(await wallet01.getRawPublicKey()).toBe(PUBLIC_KEY_TEST_01);
});

test(("legacy-wallet.Secp256k1.private-PEM"), async () => {
  expect(wallet01.getPrivateKeyInPEM()).toBe(PRIVATE_KEY_PEM_TEST_01);
});
