import { KeyFactory } from "../../src";
import { EncryptionType } from "../../src/cryptography";
import { User } from "../../src/user";
import { WalletDescriptor } from "../../src/user/wallet-info";
import { TypeUtils, ValidationResult } from "../../src/utils";
import { DEFAULT_COINT_PATH_ALTER, LegacyWallet } from "../../src/wallet";

const PASSWORD = "abcdAbcd123.";
const testKeySlip10Vector1 =
  "evoke embrace slogan bike carry tube shallow unfold breeze soul burden direct bind company vivid";
const PRIVATE_KEY_TEST_01 =
  "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
const PRIVATE_KEY_TEST_02 =
  "3f76574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";

test("user.create-invalid-password", () => {
  expect(() => new User(null)).toThrowError("Password is required");
});

test("user.create-invalid-password-empty", () => {
  expect(() => new User("")).toThrowError("Password is required");
});

test("user.create-weak-password", () => {
  expect(() => new User("abcd")).toThrowError(
    "Password length must be 10 or longer and it must contain at least a lowercase, an uppercase, a numeric and a special character"
  );
});

test("user.create-password-custom-validator-weak", () => {
  expect(() => new User("weak", {
    passwordValidator: {
      validatorFunc: (_) => {
        return new ValidationResult(false, "Custom msg");
      }
    }
  })).toThrowError("Custom msg");
});

test("user.create-password-custom-validator-ok", () => {
  const user = new User("abcd", {
    passwordValidator: {
      validatorFunc: (_) => {
        return new ValidationResult(true);
      }
    }
  });
  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
});

test("user.create-ok", () => {
  const user = new User(PASSWORD);

  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
});

test("user.updatePassword-invalid-password", async () => {
  const user = new User(PASSWORD);
  await expect(user.updatePassword(null)).rejects.toThrowError("Password is required");
});

test("user.updatePassword-invalid-password-empty", async () => {
  const user = new User(PASSWORD);
  await expect(user.updatePassword("")).rejects.toThrowError("Password is required");
});

test("user.updatePassword-weak-password", async () => {
  const user = new User(PASSWORD);
  await expect(user.updatePassword("abcd")).rejects.toThrowError(
    "Password length must be 10 or longer and it must contain at least a lowercase, an uppercase, a numeric and a special character"
  );
});

test("user.updatePassword-password-custom-validator-weak", async () => {
  const user = new User(PASSWORD, {
    passwordValidator: {
      validatorFunc: (pwd) => {
        if (pwd === "weak") {
          return new ValidationResult(false, "Custom msg");
        }
        return new ValidationResult(true);
      }
    }
  });
  await expect(user.updatePassword("weak")).rejects.toThrowError("Custom msg");
});

test("user.updatePassword-password-custom-validator-ok", async () => {
  const user = new User(PASSWORD, {
    passwordValidator: {
      validatorFunc: (_) => {
        return new ValidationResult(true);
      }
    }
  });
  await user.updatePassword("abcd");
  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
});

test("user.updatePassword-success", async () => {
  const user = new User(PASSWORD);
  await user.updatePassword("Test1234%^");
  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
});

test("user.updatePassword-success_update-storage", async () => {
  const user = new User(PASSWORD);

  await user.updatePassword("Test1234%^");

  expect(user.hasHDWallet()).toBeFalsy();
  expect(user.hasLegacyWallets()).toBeFalsy();
});

test("user.updatePassword-HDWallet-keyPhrase", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  await user.updatePassword("Test1234%^");
  
  const keyPhrase = await user.getHDWalletKeyPhrase();
  expect(keyPhrase).toBe(testKeySlip10Vector1);
});

test("user.hd-wallet-master-seed-get-account-0", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  const acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
  expect(await acc.getRawPublicKey()).toBe(
    "03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8"
  );
});

test("user.hd-wallet-master-seed-get-account-1", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  const acc = await user.getWalletAccount(1);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/1'");
  expect(await acc.getRawPublicKey()).toBe(
    "02028391e1a891662d5fb5a6d360fed721b3b3bf599e986eae78fd9927e1e5eae7"
  );
});

test("user.hd-wallet-master-key-get-account-0", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  expect(user.getHDWallet().keySeed).toBe(KeyFactory.getInstance().toSeed(testKeySlip10Vector1));

  let acc = await user.getWalletAccount(0);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/0'");
  expect(await acc.getRawPublicKey()).toBe(
    "03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8"
  );

  acc = await user.getWalletAccount(1);
  expect(acc.getKey().getPath()).toBe("m/44'/506'/1'");
  expect(await acc.getRawPublicKey()).toBe(
    "02028391e1a891662d5fb5a6d360fed721b3b3bf599e986eae78fd9927e1e5eae7"
  );
});

test("user.hd-wallet-master-key-get-account-by-index", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  expect(user.getHDWallet().keySeed).toBe(KeyFactory.getInstance().toSeed(testKeySlip10Vector1));
  await user.addWalletAccount(0);
  await user.addWalletAccount(1);

  let walletInfo = user.getHDWallet().derivedWallets[0];
  expect(walletInfo.id).toBe("m/44'/506'/0'");
  expect(walletInfo.descriptor.name).toBe("Account 1");
  expect(walletInfo.encryptionType).toBe(EncryptionType.Secp256k1);
  expect(walletInfo.index).toBe(0);

  const acc = await user.getWalletAccount(walletInfo.index);
  expect(await acc.getRawPublicKey()).toBe(
    "03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8"
  );

  walletInfo = user.getHDWallet().derivedWallets[1];
  expect(walletInfo.id).toBe("m/44'/506'/1'");
  expect(walletInfo.descriptor.name).toBe("Account 2");
  expect(walletInfo.encryptionType).toBe(EncryptionType.Secp256k1);
  expect(walletInfo.index).toBe(1);
});

test("user.hd-wallet.customPath.master-key-get-account-by-index", async () => {
  const user = new User(PASSWORD, null, DEFAULT_COINT_PATH_ALTER);
  
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  expect(user.getHDWallet().keySeed).toBe(KeyFactory.getInstance().toSeed(testKeySlip10Vector1));
  await user.addWalletAccount(0);
  await user.addWalletAccount(1);

  let walletInfo = user.getHDWallet().derivedWallets[0];
  expect(walletInfo.id).toBe("m/44'/506'/0'/0/0");
  expect(walletInfo.descriptor.name).toBe("Account 1");
  expect(walletInfo.index).toBe(0);

  walletInfo = user.getHDWallet().derivedWallets[1];
  expect(walletInfo.id).toBe("m/44'/506'/0'/0/1");
  expect(walletInfo.descriptor.name).toBe("Account 2");
  expect(walletInfo.index).toBe(1);
});

test("user.hd-wallet-master-key-get-accounts-ref-key", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Secp256k1);

  expect(user.getHDWallet().keySeed).toBe(KeyFactory.getInstance().toSeed(testKeySlip10Vector1));
  await user.addWalletAccount(0);
  await user.addWalletAccount(1);

  let walletInfo = user.getHDWallet().derivedWallets[0];
  expect(walletInfo.id).toBe("m/44'/506'/0'");

  let acc = await user.getWalletAccountByRefKey(walletInfo.id);
  expect(await acc.getRawPublicKey()).toBe(
    "03d8313be4f6450756b1928efcc6b0811e4a101dd66f40fd4f92f98fe20fedf7e8"
  );

  walletInfo = user.getHDWallet().derivedWallets[1];
  expect(walletInfo.id).toBe("m/44'/506'/1'");

  acc = await user.getWalletAccountByRefKey(walletInfo.id);
  expect(await acc.getRawPublicKey()).toBe(
    "02028391e1a891662d5fb5a6d360fed721b3b3bf599e986eae78fd9927e1e5eae7"
  );
});

test("user.hd-wallet-set-wallet-info-acc-0", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  user.setWalletInfo(
    acc.getKey().getPath(),
    new WalletDescriptor("Account 01")
  );

  const walletInfo = user.getWalletInfo(acc.getKey().getPath());
  expect(walletInfo.descriptor.name).toBe("Account 01");
});

test("user.hd-wallet-get-wallet-info-by-id", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  user.setWalletInfo(
    acc.getKey().getPath(),
    new WalletDescriptor("Account 01")
  );

  const walletInfo = user.getWalletInfo(acc.getKey().getPath());

  const wlInfo = user.getWalletInfo(walletInfo.id);
  expect(wlInfo.id).toBe(acc.getKey().getPath());
});

test("user.hd-wallet-get-wallet-info-by-uid", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  user.setWalletInfo(
    acc.getKey().getPath(),
    new WalletDescriptor("Account 01")
  );

  const walletInfo = user.getWalletInfo(acc.getKey().getPath());

  const wlInfo = user.getWalletInfo(walletInfo.uid);
  expect(wlInfo.id).toBe(acc.getKey().getPath());
});

test("user.hd-wallet-remove-wallet-info-by-id", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  user.setWalletInfo(
    acc.getKey().getPath(),
    new WalletDescriptor("Account 01")
  );

  const walletInfo = user.getWalletInfo(acc.getKey().getPath());

  user.removeWalletInfo(walletInfo.id);

  const wlInfo = user.getWalletInfo(walletInfo.id);
  expect(wlInfo).toBeUndefined();
});

test("user.hd-wallet-remove-wallet-info-by-uid", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const acc = await user.getWalletAccount(0);
  user.setWalletInfo(
    acc.getKey().getPath(),
    new WalletDescriptor("Account 01")
  );

  const walletInfo = user.getWalletInfo(acc.getKey().getPath());

  user.removeWalletInfo(walletInfo.uid);

  const wlInfo = user.getWalletInfo(walletInfo.id);
  expect(wlInfo).toBeUndefined();
});

test("user.hd-wallet-get_keyPhrase", async () => {
  const user = new User(PASSWORD);
  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const keyPhrase = await user.getHDWalletKeyPhrase();
  expect(keyPhrase).toBe(testKeySlip10Vector1);
});

test("user.legacy-wallet-set-wallet-1", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()));
  expect(acc.id).toBe(PRIVATE_KEY_TEST_01);
  expect(acc.descriptor.name).toBe("Legacy wallet 1");
});

test("user.legacy-wallet-set-wallet-1-add-info", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  const walletKey = TypeUtils.parseHexToString(wallet.getKey());

  user.setWalletInfo(walletKey, new WalletDescriptor("My legacy wallet 1"));

  const acc = user.getWalletInfo(walletKey);
  expect(acc.descriptor.name).toBe("My legacy wallet 1");
});

test("user.legacy-wallet-set-wallet-1-no-duplication", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet, new WalletDescriptor("My legacy wallet 1"));
  expect(user.getLegacyWallets().length).toBe(1);

  user.addLegacyWallet(wallet, new WalletDescriptor("My legacy wallet 2"))
  expect(user.getLegacyWallets().length).toBe(1);

  expect(user.getWalletInfo(PRIVATE_KEY_TEST_01).descriptor.name).toBe("My legacy wallet 2");
});

test("user.legacy-wallet-get-wallet-by-id", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()));

  const wlInfo = user.getWalletInfo(acc.id);
  expect(wlInfo.id).toBe(PRIVATE_KEY_TEST_01);
});

test("user.legacy-wallet-get-wallet-by-uid", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()));

  const wlInfo = user.getWalletInfo(acc.uid);
  expect(wlInfo.id).toBe(PRIVATE_KEY_TEST_01);
});

test("user.legacy-wallet-remove-wallet-by-id", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()));

  user.removeWalletInfo(acc.id);

  const wlInfo = user.getWalletInfo(acc.id);
  expect(wlInfo).toBeUndefined();
});

test("user.legacy-wallet-remove-wallet-by-uid", async () => {
  const user = new User(PASSWORD);

  const wallet = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  user.addLegacyWallet(wallet);

  expect(user.hasLegacyWallets()).toBeTruthy();

  const acc = user.getWalletInfo(TypeUtils.parseHexToString(wallet.getKey()));

  user.removeWalletInfo(acc.uid);

  const wlInfo = user.getWalletInfo(acc.id);
  expect(wlInfo).toBeUndefined();
});

test("user.deserializeFrom", async () => {
  const user = await prepareTestUser();

  const encryptedUserInfo = await user.serialize();

  const user2 = await User.deserializeFrom(PASSWORD, encryptedUserInfo);

  validateDecryptedUserInfo(user, user2);
});

test("user.deserializeFrom.customPath", async () => {
  const user = await prepareTestUser(DEFAULT_COINT_PATH_ALTER);

  const encryptedUserInfo = await user.serialize();

  const user2 = await User.deserializeFrom(PASSWORD, encryptedUserInfo);

  expect(user2.getHDWallet().pathTemplate).toBe(DEFAULT_COINT_PATH_ALTER);

  validateDecryptedUserInfo(user, user2);
});

test("user.deserializeFrom_LegacyKeyPhrase", async () => {
  const user = await prepareTestUser();

  const obj = {
    hdWallet: user.getHDWallet(),
    legacyWallets: user.getLegacyWallets(),
  };

  const infoJSON = JSON.stringify(obj);
  const info = JSON.parse(infoJSON);

  delete info.hdWallet.keySeed;
  info.hdWallet.keyPhrase = testKeySlip10Vector1;

  const encryptedUserInfo = await user.encrypt(JSON.stringify(info));
  const user2 = await User.deserializeFrom(PASSWORD, encryptedUserInfo);

  validateDecryptedUserInfo(user, user2);
});

async function prepareTestUser(walletPath: string = null) {
  const user = new User(PASSWORD, null, walletPath);

  await user.setHDWallet(testKeySlip10Vector1, EncryptionType.Ed25519);

  const wallet1 = new LegacyWallet(PRIVATE_KEY_TEST_01, EncryptionType.Ed25519);
  const wallet1Key = TypeUtils.parseHexToString(wallet1.getKey());
  user.addLegacyWallet(wallet1);
  user.setWalletInfo(wallet1Key, new WalletDescriptor("My legacy wallet 1"));

  const wallet2 = new LegacyWallet(
    PRIVATE_KEY_TEST_02,
    EncryptionType.Secp256k1
  );
  user.addLegacyWallet(wallet2, new WalletDescriptor("My legacy wallet 2"));

  return user;
}

function validateDecryptedUserInfo(user: User, user2: User) {
  const user2HDWallet = user2.getHDWallet();

  expect(user2HDWallet).not.toBeNull();
  expect(user2HDWallet.keySeed).toBe(user.getHDWallet().keySeed);
  expect(user2HDWallet.encryptionType).toBe(
    user.getHDWallet().encryptionType
  );

  expect(user2.getLegacyWallets().length).toBe(2);
  const user2Wallet1 = user.getWalletInfo(user.getLegacyWallets()[0].id);
  expect(user2Wallet1.descriptor.name).toBe("My legacy wallet 1");

  const user2Wallet2 = user.getWalletInfo(user.getLegacyWallets()[1].id);
  expect(user2Wallet2.descriptor.name).toBe("My legacy wallet 2");
}
