import { EncryptionType } from "../../../src/cryptography/core";
import { Hex, TypeUtils } from "../../../src/utils";
import { Wallet } from "../../../src/wallet";
import { CoinPath, CoinType, DEFAULT_COINT_PATH, DEFAULT_COINT_PATH_FULL, Purpose } from "../../../src/wallet/core";
import { HDWallet } from "../../../src/wallet/hdwallet";

const coinPath = new CoinPath(DEFAULT_COINT_PATH, Purpose.BIP44, CoinType.Bitcoin);
const coinPath2 = new CoinPath(DEFAULT_COINT_PATH_FULL, Purpose.BIP44, CoinType.Bitcoin);

const testSeedSlip10Vector1 = "000102030405060708090a0b0c0d0e0f";
const testSeedSlip10Vector2 = "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542";
// Test vectors: https://github.com/satoshilabs/slips/blob/master/slip-0010.md

class TestHDWallet extends HDWallet<Wallet> {
  constructor(seed: Hex, _coinPath: CoinPath = coinPath) {
    super(Wallet, _coinPath, EncryptionType.Ed25519, seed)
  }
}

test(("hd-wallet.Ed25519.ctor"), () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  expect(hdWallet.getEncryptionType()).toBe(EncryptionType.Ed25519);
  expect(hdWallet.getCoinPath().path).toBe(coinPath.path);
});

test(("hd-wallet.Ed25519.getMasterWallet"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");
});

test(("hd-wallet.Ed25519.getAccount.0"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getAccount(0);

  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'");
});

test(("hd-wallet.Ed25519.getAccount.1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getAccount(1);

  expect(wallet.getKey().getPath()).toBe("m/44'/0'/1'");
});

test(("hd-wallet.Ed25519.getAccount.1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getAccount(1);

  expect(wallet.getKey().getPath()).toBe("m/44'/0'/1'");
});

test(("hd-wallet.Ed25519.getAccount.customPath"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1, coinPath2);

  let wallet = await hdWallet.getMasterWallet();
  expect(wallet.getKey().getPath()).toBe("m");

  wallet = await hdWallet.getAccount(0);
  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'/0/0");

  wallet = await hdWallet.getAccount(1);
  expect(wallet.getKey().getPath()).toBe("m/44'/0'/0'/0/1");
});

test(("hd-wallet.Ed25519.slip10-vector1-t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");

  expect(wallet.getKey().getParentFingerPrint()).toBe(0);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("00a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed");
});

test(("hd-wallet.Ed25519.slip10-vector1.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.getKey().getPath()).toBe("m/0'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xddebc675);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("008c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c");
});

test(("hd-wallet.Ed25519.slip10-vector1.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1");

  expect(wallet.getKey().getPath()).toBe("m/0'/1");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x13dab143);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("a320425f77d1b5c2505a6b1b27382b37368ee640e3557c315416801243552f14");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("b1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("001932a5270f335bed617d5b935c80aedb1a35bd9fc1e31acafd5372c30f5c1187");
});

test(("hd-wallet.Ed25519.slip10-vector1.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xebe4cb29);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("00ae98736566d30ed0e9d2f4486a64bc95740d89c7db33f52121f8ea8f76ff0fc1");
});

test(("hd-wallet.Ed25519.slip10-vector1.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x316ec1c6);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("8f6d87f93d750e0efccda017d662a1b31a266e4a6f5993b15f5c1f07f74dd5cc");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("30d1dc7e5fc04c31219ab25a27ae00b50f6fd66622f6e9c913253d6511d1e662");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("008abae2d66361c879b900d204ad2cc4984fa2aa344dd7ddc46007329ac76c429c");
});

test(("hd-wallet.Ed25519.slip10-vector1.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector1);
  let wallet = await hdWallet.getWalletFromPath("m/0'/1/2'/2/1000000000");

  expect(wallet.getKey().getPath()).toBe("m/0'/1/2'/2/1000000000");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xd6322ccd);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("68789923a0cac2cd5a29172a475fe9e0fb14cd6adb5ad98a3fa70333e7afa230");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("003c24da049451555d51a7014a37337aa4e12d41e485abccfa46b47dfb2af54b7a");
});

test(("hd-wallet.Ed25519.slip10-vector2.t1"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");
  
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("008fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a");
});

test(("hd-wallet.Ed25519.slip10-vector2.t2"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.getKey().getPath()).toBe("m/0'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x31981b50);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("0086fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037");
});

test(("hd-wallet.Ed25519.slip10-vector2.t3"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0'/2147483647'");

  expect(wallet.getKey().getPath()).toBe("m/0'/2147483647'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x1e9411b1);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("005ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d");
});

test(("hd-wallet.Ed25519.slip10-vector2.t4"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0'/2147483647'/1'");

  expect(wallet.getKey().getPath()).toBe("m/0'/2147483647'/1'");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xfcadf38c);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("002e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45");
});

test(("hd-wallet.Ed25519.slip10-vector2.t5"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0'/2147483647'/1'/2147483646");

  expect(wallet.getKey().getPath()).toBe("m/0'/2147483647'/1'/2147483646");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0xaca70953);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("00e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b");
});

test(("hd-wallet.Ed25519.slip10-vector2.t6"), async () => {
  let hdWallet = new TestHDWallet(testSeedSlip10Vector2);
  let wallet = await hdWallet.getWalletFromPath("m/0'/2147483647'/1'/2147483646/2");

  expect(wallet.getKey().getPath()).toBe("m/0'/2147483647'/1'/2147483646/2");
  expect(wallet.getKey().getParentFingerPrint()).toBe(0x422c654b);
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getChainCode())).toBe("5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4");
  expect(TypeUtils.convertArrayToHexString(wallet.getKey().getPrivateKey())).toBe("551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d");
  expect(TypeUtils.convertArrayToHexString(await wallet.getKey().getPublicKey())).toBe("0047150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0");
});