import { AESUtils } from "../../../src/cryptography/utils/aes-utils";

const TEST_PWD_01 = "password_to-test";

test("crypto-utils.encrypt-invalid-key", () => {
  expect(() => AESUtils.encrypt(null, null)).toThrowError("Key is required");
})

test("crypto-utils.encrypt-invalid-value-null", () => {
  expect(() => AESUtils.encrypt(TEST_PWD_01, null)).toThrowError("Value is required");
})

test("crypto-utils.encrypt-invalid-value-empty", () => {
  expect(() => AESUtils.encrypt(TEST_PWD_01, "")).toThrowError("Value is required");
})

test("crypto-utils.decrypt-invalid-key", () => {
  expect(() => AESUtils.decrypt(null, null)).toThrowError("Key is required");
})

test("crypto-utils.decrypt-invalid-value-null", () => {
  expect(() => AESUtils.decrypt(TEST_PWD_01, null)).toThrowError("Encrypted value is required");
})

test("crypto-utils.decrypt-invalid-value-empty", () => {
  expect(() => AESUtils.decrypt(TEST_PWD_01, "")).toThrowError("Encrypted value is required");
})

test("crypto-utils.test1", () => {
  const encryptedText = AESUtils.encrypt(TEST_PWD_01, "Simple test value");
  const decryptedValue = AESUtils.decrypt(TEST_PWD_01, encryptedText);
  expect(decryptedValue).toBe("Simple test value");
})

test("crypto-utils.test2", () => {
  const encryptedText = AESUtils.encrypt(TEST_PWD_01, "a");
  const decryptedValue = AESUtils.decrypt(TEST_PWD_01, encryptedText);
  expect(decryptedValue).toBe("a");
})

test("crypto-utils.test3", () => {
  const encryptedText = AESUtils.encrypt(TEST_PWD_01, "aaaaaaaaaaaaabbbbbbbbbbbbccccccccccccccddddddddddddddeeeeeeeeeeeeefffffffffffffff");
  const decryptedValue = AESUtils.decrypt(TEST_PWD_01, encryptedText);
  expect(decryptedValue).toBe("aaaaaaaaaaaaabbbbbbbbbbbbccccccccccccccddddddddddddddeeeeeeeeeeeeefffffffffffffff");
})

test("crypto-utils.test4", () => {
  let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu consectetur orci. Phasellus dictum turpis ligula, sodales mattis ligula luctus a. Fusce elementum euismod commodo. Etiam bibendum eros eu nisl consectetur blandit. Donec egestas mollis lorem ac tincidunt. Nam dapibus, odio sit amet maximus pretium, massa erat feugiat ex, in laoreet enim odio quis risus. Mauris a ultricies nibh.
  Ut ultricies neque vel nunc egestas pellentesque ac at eros. Duis tincidunt nisl vel nunc maximus, id placerat nunc gravida. In hac habitasse platea dictumst. Duis posuere nunc in turpis convallis, quis lacinia est condimentum. Vestibulum suscipit interdum tincidunt. Fusce nec lacus dolor. Nulla vel dictum magna. Phasellus finibus eu arcu molestie scelerisque. Nulla feugiat vestibulum enim, et sollicitudin justo congue faucibus. Integer dictum tellus vel orci venenatis, sit amet feugiat massa porttitor. Vivamus aliquet hendrerit lacinia. Curabitur sed urna vel lacus cursus aliquam. Donec gravida vulputate dignissim. Donec ac tellus viverra, pulvinar lorem eu, imperdiet orci. Nunc accumsan purus a lacus molestie, eget semper metus eleifend. Mauris ac risus augue.
  Morbi et mi molestie, rutrum magna sit amet, vestibulum velit. Praesent eu suscipit nisl. Vestibulum faucibus ullamcorper odio in pellentesque. Mauris congue condimentum ipsum, sed volutpat est luctus vel. Suspendisse lobortis, tortor sed mattis vulputate, diam lorem accumsan risus, vitae accumsan felis arcu consectetur purus. Suspendisse pretium bibendum tortor, lacinia dapibus ligula. Proin sed elit a felis rhoncus egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vitae accumsan metus, vitae vehicula risus.`;
  const encryptedText = AESUtils.encrypt(TEST_PWD_01, text);
  const decryptedValue = AESUtils.decrypt(TEST_PWD_01, encryptedText);
  expect(decryptedValue).toBe(text);
})