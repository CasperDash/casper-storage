import { Ed25519 } from "../../../src/cryptography/key/ed25519"
import { TypeUtils } from "../../../src/utils";

const PRIVATE_KEY_TEST_01 = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PUBLIC_KEY_TEST_01  = "041da081d7ec39e20755a088c1c90987a496dd1062cda70771657f1103c77670";
const PRIVATE_KEY_PEM_TEST_01 = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDB2V0tM9GCF/5yIeiH2vKLm7BYvegpytGccLXcNoBSm
-----END PRIVATE KEY-----`;
const PUBLIC_KEY_PEM_TEST_01 = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEABB2ggdfsOeIHVaCIwckJh6SW3RBizacHcWV/EQPHdnA=
-----END PUBLIC KEY-----`;

test("ed25519.generatePrivateKey-ok", async () => {
  const privateKey = await Ed25519.generatePrivateKey();
  expect(privateKey).not.toBeFalsy();
  expect(privateKey.length).toBe(32);
})

test("ed25519.generatePrivateKey-ramdom", async () => {
  const generatedKeys = {};
  for (var i = 0; i < 1000; i++) {
    const privateKey = TypeUtils.convertArrayToHexString(await Ed25519.generatePrivateKey());
    expect(generatedKeys[privateKey]).toBeFalsy();
    generatedKeys[privateKey] = true;
  }
})

test("ed25519.createPublicKey-t1", async () => {
  expect(TypeUtils.parseHexToString(await Ed25519.createPublicKey("5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72"))).toBe("e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b");
})

test("ed25519.createPublicKey-t2", async () => {
  expect(TypeUtils.parseHexToString(await Ed25519.createPublicKey("551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d"))).toBe("47150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0");
})

test("ed25519.publicKeyTweakAdd.not-supported", async () => {
  await expect(Ed25519.publicKeyTweakAdd()).rejects.toThrowError("This method is not supported");
})

test("ed25519.getKeyInPEM.private", async () => {
  expect(Ed25519.getKeyInPEM(TypeUtils.parseHexToArray(PRIVATE_KEY_TEST_01), true)).toBe(PRIVATE_KEY_PEM_TEST_01);
})

test("ed25519.getKeyInPEM.public", async () => {
  expect(Ed25519.getKeyInPEM(TypeUtils.parseHexToArray(PUBLIC_KEY_TEST_01), false)).toBe(PUBLIC_KEY_PEM_TEST_01);
})
