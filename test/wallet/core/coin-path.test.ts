import { CoinPath, CoinType, Purpose } from "@/wallet/core";

test("coint-path.ctor.bip44-bitcoin", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Bitcoin);
  expect(coinPath.path).toBe("m/44'/0'");
});

test("coint-path.ctor.bip44-bitcoin-testnet", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.BitcoinTestnet);
  expect(coinPath.path).toBe("m/44'/1'");
});

test("coint-path.ctor.bip44-casper", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Casper);
  expect(coinPath.path).toBe("m/44'/506'");
});

test("coint-path.ctor.bip44-casper", () => {
  let coinPath = new CoinPath(Purpose.BIP49, CoinType.Casper);
  expect(coinPath.path).toBe("m/49'/506'");
});

test("coint-path.createPath.0-0-0", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(0, false, 0)).toBe("m/44'/506'/0'/0/0");
});

test("coint-path.createPath.0-0-1", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(0, false, 1)).toBe("m/44'/506'/0'/0/1");
});

test("coint-path.createPath.1-0-1", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(1, false, 1)).toBe("m/44'/506'/1'/0/1");
});

test("coint-path.createPath.1-1-1", () => {
  let coinPath = new CoinPath(Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(1, true, 1)).toBe("m/44'/506'/1'/1/1");
});