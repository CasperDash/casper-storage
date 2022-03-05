import { EncryptionType, KeyParser } from "@/cryptography";
import { TypeUtils } from "@/utils";

const keyParser = KeyParser.getInstance(EncryptionType.Secp256k1);

const test01PrivatePEM = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIAbcHX0FGWnUEelmxsAtPQJbWG9sGpxWiO+haLWRlwj0oAcGBSuBBAAK
oUQDQgAEe424z2dSUsYePeaTKzrHkLo58emSdaotPwVJZ2f+N8+5Cw8eLpukxpvA
qPD0f41wM+8QJxGj41A1QGLpsckvmA==
-----END EC PRIVATE KEY-----`;
const test01PrivateKey = `06dc1d7d051969d411e966c6c02d3d025b586f6c1a9c5688efa168b5919708f4`;

test("key-parser.parser-private-key_content-nullOrEmpty", () => {
  expect(() => keyParser.convertPEMToPrivateKey(null)).toThrow("PEM content is required");
  expect(() => keyParser.convertPEMToPrivateKey("")).toThrow("PEM content is required");
})

test("key-parser.parser-private-key_content-invalid", () => {
  expect(() => keyParser.convertPEMToPrivateKey("SomethingHere")).toThrowError();
})

test("key-parser.parser-private-key_content-test01", () => {
  const keyData = keyParser.convertPEMToPrivateKey(test01PrivatePEM);
  const keyHex = TypeUtils.convertArrayToHexString(keyData);
  expect(keyHex).toBe(test01PrivateKey);
})
