import { HDKeyManagerFactory } from "@/bips/bip32"
import { EncryptionType } from "@/cryptography"
import { TypeUtils } from "@/utils";

const testSeedSlip10Vector1 = "000102030405060708090a0b0c0d0e0f";

const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Secp256k1);

test("hd-key-manager-secp256k1.fromMasterSeed-null", async () => {
  expect(() => keyManager.fromMasterSeed(null)).toThrow("Master seed is required");
})

test("hd-key-manager-secp256k1.fromMasterSeed", async () => {
  const masterHDKey = keyManager.fromMasterSeed(testSeedSlip10Vector1);
  expect(masterHDKey.getPath()).toBe("m");
  expect(masterHDKey.getParentFingerPrint()).toBe(0);
  expect(TypeUtils.convertArrayToHexString(masterHDKey.getChainCode())).toBe("873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508");
  expect(TypeUtils.convertArrayToHexString(masterHDKey.getPrivateKey())).toBe("e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35");
  expect(TypeUtils.convertArrayToHexString(await masterHDKey.getPublicKey())).toBe("0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2");
})
