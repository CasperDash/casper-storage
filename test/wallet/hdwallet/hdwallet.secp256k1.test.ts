import { EncryptionType } from "../../../src/cryptography/core";
import { Hex, TypeUtils } from "../../../src/utils";
import { Wallet } from "../../../src/wallet";
import { CoinPath, CoinType, DEFAULT_COINT_PATH, DEFAULT_COINT_PATH_FULL, Purpose } from "../../../src/wallet/core";
import { HDWallet } from "../../../src/wallet/hdwallet";

const coinPath = new CoinPath(DEFAULT_COINT_PATH, Purpose.BIP44, CoinType.Bitcoin);
const coinPath2 = new CoinPath(DEFAULT_COINT_PATH_FULL, Purpose.BIP44, CoinType.Bitcoin);

const testSeedSlip10Vector1 = "000102030405060708090a0b0c0d0e0f";
const testSeedSlip10vector2 = "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542";
const testSeedBip32Vector1 = "000102030405060708090a0b0c0d0e0f";
const testSeedBip32vector2 = "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542";

// Validated based on https://iancoleman.io/bip39/
// https://github.com/satoshilabs/slips/blob/master/slip-0010.md
// Test vectors: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki

class TestHDWallet extends HDWallet<Wallet> {
  constructor(seed: Hex, _coinPath: CoinPath = coinPath) {
    super(Wallet, _coinPath, EncryptionType.Secp256k1, seed)
  }
}

test(("hd-wallet.Secp256k1.ctor"), () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  expect(hdWallet.getEncryptionType()).toBe(EncryptionType.Secp256k1);
  expect(hdWallet.getCoinPath().path).toBe(coinPath.path);
});

test(("hd-wallet.Secp256k1.getMasterWallet"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");
});

test(("hd-wallet.Secp256k1.getAccount.0"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getAccount(0);

  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'");
});

test(("hd-wallet.Secp256k1.getAccount.1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getAccount(1);

  expect(wallet.getKey().getPath()).toBe("m/44'/0'/1'");
});

test(("hd-wallet.Secp256k1.getAccount.customPath"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1, coinPath2);

  let wallet = await hdWallet.getMasterWallet();
  expect(wallet.getKey().getPath()).toBe("m");

  wallet = await hdWallet.getAccount(0);
  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'/0/0");

  wallet = await hdWallet.getAccount(1);
  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'/0/1");
});

test(("hd-wallet.Secp256k1.slip10-vector1-t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");

  expect(wallet.getKey().getParentFingerPrint()).toBe(0);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2");
});

test(("hd-wallet.Secp256k1.slip10-vector1.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.getKey().getPath()).toBe("m/0'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x3442193e);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("47fdacbd0f1097043b78c63c20c34ef4ed9a111d980047ad16282c7ae6236141");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56");
});

test(("hd-wallet.Secp256k1.slip10-vector1.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1");

  expect(wallet.getKey().getPath()).toBe("m/0'/1");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x5c1bd648);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("2a7857631386ba23dacac34180dd1983734e444fdbf774041578e9b6adb37c19");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("3c6cb8d0f6a264c91ea8b5030fadaa8e538b020f0a387421a12de9319dc93368");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("03501e454bf00751f24b1b489aa925215d66af2234e3891c3b21a52bedb3cd711c");
});

test(("hd-wallet.Secp256k1.slip10-vector1.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xbef5a2f9);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("04466b9cc8e161e966409ca52986c584f07e9dc81f735db683c3ff6ec7b1503f");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("cbce0d719ecf7431d88e6a89fa1483e02e35092af60c042b1df2ff59fa424dca");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("0357bfe1e341d01c69fe5654309956cbea516822fba8a601743a012a7896ee8dc2");
});

test(("hd-wallet.Secp256k1.slip10-vector1.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xee7ab90c);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("cfb71883f01676f587d023cc53a35bc7f88f724b1f8c2892ac1275ac822a3edd");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("0f479245fb19a38a1954c5c7c0ebab2f9bdfd96a17563ef28a6a4b1a2a764ef4");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("02e8445082a72f29b75ca48748a914df60622a609cacfce8ed0e35804560741d29");
});

test(("hd-wallet.Secp256k1.slip10-vector1.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2/1000000000");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2/1000000000");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xd880d7d8);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("c783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("022a471424da5e657499d1ff51cb43c47481a03b1e77f951fe64cec9f5a48f7011");
});

test(("hd-wallet.Secp256k1.slip10-vector2-t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");

  expect(wallet.getKey().getParentFingerPrint()).toBe(0);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7");
});

test(("hd-wallet.Secp256k1.slip10-vector2.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0");

  expect(wallet.getKey().getPath()).toBe("m/0");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xbd16bee5);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("abe74a98f6c7eabee0428f53798f0ab8aa1bd37873999041703c742f15ac7e1e");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("02fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea");
});

test(("hd-wallet.Secp256k1.slip10-vector2.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x5a61ff8e);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("be17a268474a6bb9c61e1d720cf6215e2a88c5406c4aee7b38547f585c9a37d9");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("877c779ad9687164e9c2f4f0f4ff0340814392330693ce95a58fe18fd52e6e93");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("03c01e7425647bdefa82b12d9bad5e3e6865bee0502694b94ca58b666abc0a5c3b");
});

test(("hd-wallet.Secp256k1.slip10-vector2.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'/1");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'/1");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xd8ab4937);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("f366f48f1ea9f2d1d3fe958c95ca84ea18e4c4ddb9366c336c927eb246fb38cb");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("704addf544a06e5ee4bea37098463c23613da32020d604506da8c0518e1da4b7");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("03a7d1d856deb74c508e05031f9895dab54626251b3806e16b4bd12e781a7df5b9");
});

test(("hd-wallet.Secp256k1.slip10-vector2.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'H'/1/2147483646'");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'H'/1/2147483646'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x78412e3a);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("f1c7c871a54a804afe328b4c83a1c33b8e5ff48f5087273f04efa83b247d6a2d");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0");
});

test(("hd-wallet.Secp256k1.slip10-vector2.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'/1/2147483646'/2");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'/1/2147483646'/2");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x31a507b8);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("9452b549be8cea3ecb7a84bec10dcfd94afe4d129ebfd3b3cb58eedf394ed271");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("bb7d39bdb83ecf58f2fd82b6d918341cbef428661ef01ab97c28a4842125ac23");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("024d902e1a2fc7a8755ab5b694c575fce742c48d9ff192e63df5193e4c7afe1f9c");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m");

  expect(wallet.getKey().getPath()).toBe("m");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.getKey().getPath()).toBe("m/0'");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1");

  expect(wallet.getKey().getPath()).toBe("m/0'/1");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334");
});

test(("hd-wallet.Secp256k1.bip32-vector1.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2/1000000000");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2/1000000000");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m");

  expect(wallet.getKey().getPath()).toBe("m");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0");

  expect(wallet.getKey().getPath()).toBe("m/0");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'/1");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'/1");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'/1/2147483646'");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'/1/2147483646'");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc");
});

test(("hd-wallet.Secp256k1.bip32-vector2.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedBip32vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0/2147483647'/1/2147483646'/2");

  expect(wallet.getKey().getPath()).toBe("m/0/2147483647'/1/2147483646'/2");

  expect(await wallet.getKey().getPublicExtendedKey()).toBe("xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt");
  expect(await wallet.getKey().getPrivateExtendedKey()).toBe("xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j");
});