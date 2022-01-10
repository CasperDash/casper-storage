import { EncryptionType } from "@/cryptography/core";
import { TypeUtils } from "@/utils";
import { CasperHDWallet } from "@/wallet/common/casper";

const testSeed01 = "000102030405060708090a0b0c0d0e0f";

test(("casper-hd-wallet.ed25519.master"), async () => {
  let hdWallet = new CasperHDWallet(testSeed01, EncryptionType.Ed25519);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.key.getPath()).toBe("m");

  expect(wallet.getPrivateKey()).toBe("2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7");
  expect(await wallet.getPublicKey()).toBe("00a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed");
  expect(await wallet.getAddress()).toBe("0100a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed");
});

test(("casper-hd-wallet.ed25519.master.acc0"), async () => {
  let hdWallet = new CasperHDWallet(TypeUtils.convertHexStringToArray(testSeed01), EncryptionType.Ed25519);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.key.getPath()).toBe("m/0'");

  expect(wallet.getPrivateKey()).toBe("68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3");
  expect(await wallet.getPublicKey()).toBe("008c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c");
  expect(await wallet.getAddress()).toBe("01008c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c");
});