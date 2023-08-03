import { EncoderUtils } from "../../../src";
import { MnemonicKey } from "../../../src/key/mnemonic";
import { TypeUtils } from "../../../src/utils";

const mnKey = new MnemonicKey();
const TEST_KEY_01 = "absent car gun loud shoot hold pill latin deliver suffer often panel enable struggle shallow".split(" ");
const TEST_SEED_01 = "5d52a9c91f3850b2b88de339cd4f179d360693ee6230fd8472c40ddd9db0c2835fa706a25f3107555e707e22bce31ffbb61518d2923ffc4bdbce14fa775dcb88";
const NOT_STANDARD_KEY = "something random key from somewhere not know but it contains 12 words".split(" ");

test("generate.ok-default-24-words", () => {
  const key = mnKey.generate();
  expect(mnKey.toKey(key).length).toBe(24);
});

test("generate.ok-24-words", () => {
  const key = mnKey.generate(24);
  expect(mnKey.toKey(key).length).toBe(24);
});

test("generate.ok-15-words", () => {
  const key = mnKey.generate(15);

  expect(mnKey.toKey(key).length).toBe(15);
});

test("generate.ok-18-words", () => {
  const key = mnKey.generate(18);

  expect(mnKey.toKey(key).length).toBe(18);
});

test("generate.ok-21-words", () => {
  const key = mnKey.generate(21);

  expect(mnKey.toKey(key).length).toBe(21);
});

test("generate.ok-24-words", () => {
  const key = mnKey.generate(24);

  expect(mnKey.toKey(key).length).toBe(24);
});

test("generate.invalid-number-of-words", () => {
  expect(() => {
    mnKey.generate(13)
  }).toThrowError(/Length of words must be in allowed list/)
});

test("generate.no-duplication", () => {
  let testSize = 50;

  const keys = new Set();
  [...Array(testSize)].forEach(_ => keys.add(mnKey.generate()));

  expect(keys.size).toBe(testSize);
});

test("validate.true", () => {
  const entropy = mnKey.generate();
  const key = mnKey.toKey(entropy);
  expect(mnKey.validate(key)).toBe(true);
});

test("validate.false-short", () => {
  const key = "a random key from somewhere".split(" ");
  expect(mnKey.validate(key)).toBe(false);
});

test("validate.false-24-words", () => {
  expect(mnKey.validate(NOT_STANDARD_KEY)).toBe(false);
});

test("toEntropy-toKey", () => {
  const entropy = mnKey.toEntropy(TEST_KEY_01);
  const key = mnKey.toKey(entropy);
  expect(key).toBe(key);
});

test("toEntropy-toKey_Encoded", () => {
  const encodedKey = TEST_KEY_01.map(x => EncoderUtils.encodeBase64(x));
  const entropy = mnKey.toEntropy(encodedKey, true);
  const key = mnKey.toKey(entropy, true);
  expect(key).toBe(key);
});

test("toEntropy-toKey-not-valid-key", () => {
  const mnKey = new MnemonicKey();
  expect(() => {
    mnKey.toEntropy(NOT_STANDARD_KEY);
  }).toThrowError(/Unknown letter/);
});

test("toEntropyAsync-toKey", async () => {
  const key = TEST_KEY_01;
  let entropy = await mnKey.toEntropyAsync(key);
  let regeneratedkey = mnKey.toKey(entropy);
  expect(regeneratedkey.join(" ")).toBe(key.join(" "));
});

test("toEntropyAsync-toKey-not-valid-key", async () => {
  await expect(mnKey.toEntropyAsync(NOT_STANDARD_KEY)).rejects.toThrowError(/Unknown letter/);
});

test("toEntropyAsync-toKeyAsync", async () => {
  const key = TEST_KEY_01;
  let entropy = await mnKey.toEntropyAsync(key);
  let regeneratedkey = await mnKey.toKeyAsync(entropy);
  expect(regeneratedkey.join(" ")).toBe(key.join(" "));
});

test("toSeed-ok", () => {
  const seed = mnKey.toSeed(mnKey.toEntropy(TEST_KEY_01))
  expect(seed).toBe(TEST_SEED_01);
})

test("toSeedAsync-ok", async () => {
  const seed = await mnKey.toSeedAsync(mnKey.toEntropy(TEST_KEY_01))
  expect(seed).toBe(TEST_SEED_01);
})

test("toSeedArray-ok", () => {
  const seed = TypeUtils.parseHexToString(mnKey.toSeedArray(mnKey.toEntropy(TEST_KEY_01)));
  expect(seed).toBe(TEST_SEED_01);
})

test("toSeedArrayAsync-ok", async () => {
  const seed = TypeUtils.parseHexToString(await mnKey.toSeedArrayAsync(mnKey.toEntropy(TEST_KEY_01)));
  expect(seed).toBe(TEST_SEED_01);
})