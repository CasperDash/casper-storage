import { EncryptionType, KeyParser } from "../../../../src/cryptography";
import { TypeUtils } from "../../../../src/utils";

const keyParser = KeyParser.getInstance(EncryptionType.Ed25519);

const test01PrivatePEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDB2V0tM9GCF/5yIeiH2vKLm7BYvegpytGccLXcNoBSm
-----END PRIVATE KEY-----`;
const test01PrivateKey = `3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6`;

test("key-parser.parser-private-key_content-nullOrEmpty", () => {
  expect(() => keyParser.convertPEMToPrivateKey(null)).toThrow("PEM content is required");
  expect(() => keyParser.convertPEMToPrivateKey("")).toThrow("PEM content is required");
})

test("key-parser.parser-private-key_content-invalid", () => {
  expect(() => keyParser.convertPEMToPrivateKey("SomethingHere")).toThrowError();
})

test("key-parser.parser-private-key_content-test01", () => {
  const keyData = keyParser.convertPEMToPrivateKey(test01PrivatePEM);
  const keyHex = TypeUtils.convertArrayToHexString(keyData.key);
  expect(keyHex).toBe(test01PrivateKey);
})
