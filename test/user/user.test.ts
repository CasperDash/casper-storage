import { EncryptionType } from "@/cryptography";
import { User } from "@/user";
import { WalletDescriptor } from "@/user/wallet-info";
import { TypeUtils } from "@/utils";
import { LegacyWallet } from "@/wallet";

const PASSWORD = "pwd";
const testSeedSlip10Vector1 = "000102030405060708090a0b0c0d0e0f";
const PRIVATE_KEY_TEST_01 = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PRIVATE_KEY_TEST_02 = "3f76574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";

test("user.create-invalid-password", () => {
  expect(() => new User(null)).toThrowError("Password is required to work with user information");
})

test("user.create-invalid-password-empty", () => {
  expect(() => new User("")).toThrowError("Password is required to work with user information");
})

test("user.create-ok", () => {
  const user = new User(PASSWORD);

  expect(user.getHDWallet()).toBeUndefined();
  expect(user.hasLegacyWallets()).toBeFalsy();
})

test("user.hd-wallet-get-account-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
})

test("user.hd-wallet-get-account-1", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(1);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/1'");
})

test("user.hd-wallet-get-account-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
})

test("user.hd-wallet-set-wallet-info-acc-0", async () => {
  const user = new User(PASSWORD);
  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  user.addWalletAccount(0);
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

  const acc = await user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()), true);
  expect(acc.key).toBe(PRIVATE_KEY_TEST_01);
})

test("user.legacy-wallet-set-wallet-1-add-info", async () => {
  const user = new User(PASSWORD);

  let wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  const walletKey = TypeUtils.parseHexToString(wallet.getKey());

  user.setWalletInfo(walletKey, new WalletDescriptor("My legacy wallet 1"), true)

  const acc = await user.getWalletInfo(walletKey, true);
  expect(acc.descriptor.name).toBe("My legacy wallet 1");
})

test("user.serialize-both-type-wallets", async () => {
  const user = new User(PASSWORD);

  user.setHDWallet(testSeedSlip10Vector1, EncryptionType.Ed25519);

  const wallet1 = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  const wallet1Key = TypeUtils.parseHexToString(wallet1.getKey());
  user.addLegacyWallet(wallet1);
  user.setWalletInfo(wallet1Key, new WalletDescriptor("My legacy wallet 1"), true);

  const wallet2 = new LegacyWallet(PRIVATE_KEY_TEST_02, EncryptionType.Secp256k1);
  const wallet2Key = TypeUtils.parseHexToString(wallet2.getKey());
  user.addLegacyWallet(wallet2, new WalletDescriptor("My legacy wallet 2"));

  const encryptedUserInfo = user.serialize();

  const user2 = new User(PASSWORD);
  user2.deserialize(encryptedUserInfo);

  expect(user2.getHDWallet()).not.toBeNull();
  expect(user2.getHDWallet().key).toBe(user.getHDWallet().key);
  expect(user2.getHDWallet().type).toBe(user.getHDWallet().type);

  expect(user2.getLegacyWallets().length).toBe(2);
  const user2Wallet1 = user.getWalletInfo(wallet1Key, true);
  expect(user2Wallet1.descriptor.name).toBe("My legacy wallet 1");

  const user2Wallet2 = user.getWalletInfo(wallet2Key, true);
  expect(user2Wallet2.descriptor.name).toBe("My legacy wallet 2");
})
