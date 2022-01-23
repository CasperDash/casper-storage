import { MnemonicKey } from "@/key/mnemonic";

const NOT_STANDARD_KEY = "something random key from somewhere not know but it contains 12 words";

test("generate.ok-default-24-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate();

  expect(key.split(" ").length).toBe(24);
});

test("generate.ok-12-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate(12);

  expect(key.split(" ").length).toBe(12);
});

test("generate.ok-15-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate(15);

  expect(key.split(" ").length).toBe(15);
});

test("generate.ok-18-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate(18);

  expect(key.split(" ").length).toBe(18);
});

test("generate.ok-21-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate(21);

  expect(key.split(" ").length).toBe(21);
});

test("generate.ok-24-words", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate(24);

  expect(key.split(" ").length).toBe(24);
});

test("generate.invalid-number-of-words", () => {
  let mnKey = new MnemonicKey();
  expect(() => {
    mnKey.generate(13)
  }).toThrowError(/Length of words must be in allowed list/)
});

test("generate.no-duplication", () => {
  let mnKey = new MnemonicKey();
  let testSize = 50;

  let keys = new Set();
  [...Array(testSize)].forEach(_ => keys.add(mnKey.generate()));

  expect(keys.size).toBe(testSize);
});

test("validate.true", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate();

  expect(mnKey.validate(key)).toBe(true);
});

test("validate.false-short", () => {
  let mnKey = new MnemonicKey();
  let key = "a random key from somewhere";
  expect(mnKey.validate(key)).toBe(false);
});

test("validate.false-12-words", () => {
  let mnKey = new MnemonicKey();
  expect(mnKey.validate(NOT_STANDARD_KEY)).toBe(false);
});

test("toEntropy-toKey", () => {
  let mnKey = new MnemonicKey();
  let key = mnKey.generate();
  let entropy = mnKey.toEntropy(key);
  let regeneratedkey = mnKey.toKey(entropy);
  expect(regeneratedkey).toBe(key);
});

test("toEntropy-toKey-not-valid-key", () => {
  let mnKey = new MnemonicKey();
  expect(() => {
    mnKey.toEntropy(NOT_STANDARD_KEY);
  }).toThrowError(/Invalid mnemonic/);
});
