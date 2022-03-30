import { EncryptionType } from "@/cryptography";
import { User } from "@/user";
import { WalletDescriptor } from "@/user/wallet-info";
import { TypeUtils, ValidationResult } from "@/utils";
import { LegacyWallet } from "@/wallet";

const PASSWORD = "abcdAbcd123.";
const testKeySlip10Vector1 = "evoke embrace slogan bike carry tube shallow unfold breeze soul burden direct bind company vivid";
const testSeedSlip10Vector1 = "e2d16ae1324693cc4a04ab4597bad00713455f69d8b43804de81c2679b24199ad3aed15700f4517403be451a2853e5e6f93a0b5a91cc11ef3599e72577ba747a";
const PRIVATE_KEY_TEST_01 = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PRIVATE_KEY_TEST_02 = "3f76574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";

test("user.create-invalid-password", () => {
  expect(() => new User(null)).toThrowError("Password is required");
})

test("user.create-invalid-password-empty", () => {
  expect(() => new User("")).toThrowError("Password is required");
})

test("user.create-weak-password", () => {
  expect(() => new User("abcd")).toThrowError("Password length must be 10 or longer and it must contain at least a lowercase, an uppercase, a numeric and a special character");
})

test("user.create-password-custom-validator-weak", () => {
  expect(() => new User("abcd", {
    passwordValidator: (_) => {
      return new ValidationResult(false, "Custom msg");
    }
  })).toThrowError("Custom msg");
})

test("user.create-password-custom-validator-ok", () => {
  const user = new User("abcd", {
    passwordValidator: (_) => {
      return new ValidationResult(true);
    }
  });
  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
})

test("user.create-ok", () => {
  const user = new User(PASSWORD);

  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
})

test("user.hd-wallet-master-seed-get-account-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Secp256k1);

  const acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
  expect(await acc.getPublicKey()).toBe("03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8");
})

test("user.hd-wallet-master-seed-get-account-1", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Secp256k1);

  const acc = await user.getWalletAccount(1);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/1'");
  expect(await acc.getPublicKey()).toBe("02028391e1a891662d5fb5a6d360fed721b3b3bf599e986eae78fd9927e1e5eae7");
})

test("user.hd-wallet-master-key-get-account-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  expect(user.getHDWallet().key).toBe(testSeedSlip10Vector1);

  let acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
  expect(await acc.getPublicKey()).toBe("03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8");

  acc = await user.getWalletAccount(1);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/1'");
  expect(await acc.getPublicKey()).toBe("02028391e1a891662d5fb5a6d360fed721b3b3bf599e986eae78fd9927e1e5eae7");
})

test("user.hd-wallet-set-wallet-info-acc-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  let acc = await user.getWalletAccount(0);
  user.setWalletInfo(acc.getKey().getPath(), new WalletDescriptor("Account 01"));

  let walletInfo = user.getWalletInfo(acc.getKey().getPath());
  expect(walletInfo.descriptor.name).toBe("Account 01");
})

test("user.legacy-wallet-set-wallet-1", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()), true);
  expect(acc.key).toBe(PRIVATE_KEY_TEST_01);
})

test("user.legacy-wallet-set-wallet-1-add-info", async () => {
  const user = new User(PASSWORD);

  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  const walletKey = TypeUtils.parseHexToString(wallet.getKey());

  user.setWalletInfo(walletKey, new WalletDescriptor("My legacy wallet 1"), true)

  const acc = user.getWalletInfo(walletKey, true);
  expect(acc.descriptor.name).toBe("My legacy wallet 1");
})

test("user.serialize-both-type-wallets", async () => {
  const user = prepareTestUser();
  const encryptedUserInfo = user.serialize();

  const user2 = new User(PASSWORD);
  user2.deserialize(encryptedUserInfo);

  validateDecryptedUserInfo(user, user2);
})

test("user.deserializeFrom", async () => {
  const user = prepareTestUser();
  const encryptedUserInfo = user.serialize();

  const user2 = User.deserializeFrom(PASSWORD, encryptedUserInfo);
  validateDecryptedUserInfo(user, user2);
})

function prepareTestUser() {
  const user = new User(PASSWORD);

  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  const wallet1 = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  const wallet1Key = TypeUtils.parseHexToString(wallet1.getKey());
  user.addLegacyWallet(wallet1);
  user.setWalletInfo(wallet1Key, new WalletDescriptor("My legacy wallet 1"), true);

  const wallet2 = new LegacyWallet(PRIVATE_KEY_TEST_02, EncryptionType.Secp256k1);
  user.addLegacyWallet(wallet2, new WalletDescriptor("My legacy wallet 2"));

  return user;
}

function validateDecryptedUserInfo(user: User, user2: User) {
  expect(user2.getHDWallet()).not.toBeNull();
  expect(user2.getHDWallet().key).toBe(user.getHDWallet().key);
  expect(user2.getHDWallet().encryptionType).toBe(user.getHDWallet().encryptionType);

  expect(user2.getLegacyWallets().length).toBe(2);
  const user2Wallet1 = user.getWalletInfo(user.getLegacyWallets()[0].key, true);
  expect(user2Wallet1.descriptor.name).toBe("My legacy wallet 1");

  const user2Wallet2 = user.getWalletInfo(user.getLegacyWallets()[1].key, true);
  expect(user2Wallet2.descriptor.name).toBe("My legacy wallet 2");
}