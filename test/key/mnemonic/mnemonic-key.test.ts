import { MnemonicKey } from "@/key/mnemonic";

test("generate.ok-default-12-words", () => {
    let mnKey = new MnemonicKey();
    let key = mnKey.generate();

    expect(key.split(" ").length).toBe(12);
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
    let key = "something random key from somewhere not know but it still contains enough words";
    expect(mnKey.validate(key)).toBe(false);
});

test("toEntropy-toKey", () => {
    let mnKey = new MnemonicKey();
    let key = mnKey.generate();
    let entropy = mnKey.toEntropy(key);
    let regeneratedkey = mnKey.toKey(entropy);
    expect(regeneratedkey).toBe(key);
});
