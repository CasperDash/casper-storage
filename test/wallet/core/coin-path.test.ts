import { CoinPath, CoinType, DEFAULT_COINT_PATH, Purpose } from "../../../src/wallet/core";

const coinPathTemplate = DEFAULT_COINT_PATH;

test("coint-path.ctor.bip44-bitcoin", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP44, CoinType.Bitcoin);
  expect(coinPath.path).toBe("m/44'/0'/INDEX'");
});

test("coint-path.ctor.bip44-bitcoin-testnet", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP44, CoinType.BitcoinTestnet);
  expect(coinPath.path).toBe("m/44'/1'/INDEX'");
});

test("coint-path.ctor.bip44-casper", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP44, CoinType.Casper);
  expect(coinPath.path).toBe("m/44'/506'/INDEX'");
});

test("coint-path.ctor.bip44-casper", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP49, CoinType.Casper);
  expect(coinPath.path).toBe("m/49'/506'/INDEX'");
});

test("coint-path.createPath.0", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(0)).toBe("m/44'/506'/0'");
});

test("coint-path.createPath.1", () => {
  let coinPath = new CoinPath(coinPathTemplate, Purpose.BIP44, CoinType.Casper)
  expect(coinPath.createPath(1)).toBe("m/44'/506'/1'");
});