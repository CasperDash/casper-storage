import { HDKeyManagerFactory } from "../../../src/bips/bip32"
import { EncryptionType } from "../../../src/cryptography"
import { TypeUtils } from "../../../src/utils";

const testSeedSlip10Vector1 = "000102030405060708090a0b0c0d0e0f";

const keyManager = HDKeyManagerFactory.getInstance(EncryptionType.Ed25519);

test("hd-key-manager-ed25519.fromMasterSeed-null", async () => {
  expect(() => keyManager.fromMasterSeed(null)).toThrow("Master seed is required");
})

test("hd-key-manager-ed25519.fromMasterSeed", async () => {
  const masterHDKey = keyManager.fromMasterSeed(testSeedSlip10Vector1);
  expect(masterHDKey.getPath()).toBe("m");
  expect(masterHDKey.getParentFingerPrint()).toBe(0);
  expect(TypeUtils.convertArrayToHexString(masterHDKey.getChainCode())).toBe("90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb");
  expect(TypeUtils.convertArrayToHexString(masterHDKey.getPrivateKey())).toBe("2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7");
  expect(TypeUtils.convertArrayToHexString(await masterHDKey.getPublicKey())).toBe("00a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed");
})
