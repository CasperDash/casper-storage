import { EncryptionType } from "../../../../src/cryptography/core";
import { TypeUtils } from "../../../../src/utils";
import { CasperHDWallet } from "../../../../src/wallet/common/casper";

const testSeed01 = "000102030405060708090a0b0c0d0e0f";

test(("casper-hd-wallet.secp256k1.master"), async () => {
  let hdWallet = new CasperHDWallet(TypeUtils.convertHexStringToArray(testSeed01), EncryptionType.Secp256k1);
  let wallet = await hdWallet.getMasterWallet();

  expect(wallet.getKey().getPath()).toBe("m");

  expect(wallet.getPrivateKey()).toBe("e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35");
  expect(await wallet.getRawPublicKey()).toBe("0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2");
  expect(await wallet.getPublicKey()).toBe("020339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2");
});

test(("casper-hd-wallet.secp256k1.master.acc0"), async () => {
  let hdWallet = new CasperHDWallet(TypeUtils.convertHexStringToArray(testSeed01), EncryptionType.Secp256k1);
  let wallet = await hdWallet.getWalletFromPath("m/0'");

  expect(wallet.getKey().getPath()).toBe("m/0'");

  expect(wallet.getPrivateKey()).toBe("edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea");
  expect(await wallet.getRawPublicKey()).toBe("035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56");
  expect(await wallet.getPublicKey()).toBe("02035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56");
});