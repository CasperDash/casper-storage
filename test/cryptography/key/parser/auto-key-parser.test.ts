import { KeyParser } from "@/cryptography";
import { TypeUtils } from "@/utils";

const keyParser = KeyParser.getInstance();

const test01EDPrivatePEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDB2V0tM9GCF/5yIeiH2vKLm7BYvegpytGccLXcNoBSm
-----END PRIVATE KEY-----`;
const test01EDPrivateKey = `3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6`;

const test01ECPrivatePEM = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIAbcHX0FGWnUEelmxsAtPQJbWG9sGpxWiO+haLWRlwj0oAcGBSuBBAAK
oUQDQgAEe424z2dSUsYePeaTKzrHkLo58emSdaotPwVJZ2f+N8+5Cw8eLpukxpvA
qPD0f41wM+8QJxGj41A1QGLpsckvmA==
-----END EC PRIVATE KEY-----`;
const test01ECPrivateKey = `06dc1d7d051969d411e966c6c02d3d025b586f6c1a9c5688efa168b5919708f4`;

test("key-parser.convertPEMToPrivateKey.content-nullOrEmpty", () => {
  expect(() => keyParser.convertPEMToPrivateKey(null)).toThrow("PEM content is required");
  expect(() => keyParser.convertPEMToPrivateKey("")).toThrow("PEM content is required");
})

test("key-parser.convertPEMToPrivateKey.content-invalid", () => {
  expect(() => keyParser.convertPEMToPrivateKey("SomethingHere")).toThrowError();
})

test("key-parser.convertPEMToPrivateKey.content-ed", () => {
  const keyData = keyParser.convertPEMToPrivateKey(test01EDPrivatePEM);
  const keyHex = TypeUtils.convertArrayToHexString(keyData.key);
  expect(keyHex).toBe(test01EDPrivateKey);
})

test("key-parser.convertPEMToPrivateKey.content-ec", () => {
  const keyData = keyParser.convertPEMToPrivateKey(test01ECPrivatePEM);
  const keyHex = TypeUtils.convertArrayToHexString(keyData.key);
  expect(keyHex).toBe(test01ECPrivateKey);
})
