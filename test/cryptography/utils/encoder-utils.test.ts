import { EncoderUtils } from "@/cryptography"
import { TypeUtils } from "@/utils";

const test01PEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDB2V0tM9GCF/5yIeiH2vKLm7BYvegpytGccLXcNoBSm
-----END PRIVATE KEY-----`;
const test01DataHex = "302e020100300506032b6570042204203076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";

test("encoder-utils.readBase64PEM-nullOrEmpty", () => {
  expect(() => EncoderUtils.readBase64PEM(null)).toThrowError();
  expect(() => EncoderUtils.readBase64PEM("")).toThrowError();
})

test("encoder-utils.readBase64PEM-invalid", () => {
  expect(() => EncoderUtils.readBase64PEM("Something")).toThrowError();
})

test("encoder-utils.readBase64PEM-test01", () => {
  const data = EncoderUtils.readBase64PEM(test01PEM);
  expect(TypeUtils.convertArrayToHexString(data)).toBe(test01DataHex);
})

test("encoder-utils.encodeBase58-nullOrEmpty", () => {
  expect(() => EncoderUtils.encodeBase58(null)).toThrowError();
  expect(() => EncoderUtils.encodeBase58(new Uint8Array())).toThrowError();
})

test("encoder-utils.encodeBase58-test01", () => {
  const data = TypeUtils.convertHexStringToArray("0100FF0A1F0FF0");
  const base58Data = EncoderUtils.encodeBase58(data);
  expect(base58Data).toBe("FSSAiA8JwAQAGP");
})

test("encoder-utils.encodeText-nullOrEmpty", () => {
  expect(() => EncoderUtils.encodeText(null)).toThrowError();
  expect(() => EncoderUtils.encodeText("")).toThrowError();
})

test("encoder-utils.encodeText-test01", () => {
  const data = EncoderUtils.encodeText("SomethingHere");
  expect(TypeUtils.convertArrayToHexString(data)).toBe("536f6d657468696e6748657265");
})

test("encoder-utils.encodeText-test02", () => {
  const data = EncoderUtils.encodeText("aa");
  expect(TypeUtils.convertArrayToHexString(data)).toBe("6161");
})