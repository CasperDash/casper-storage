import { EncryptionType } from "../../../../src/cryptography";
import { CasperWalletUtils } from "../../../../src/wallet/common/casper/casper-wallet-utils";

test(("casper-wallet-utils.ed25519"), async () => {
  let value = CasperWalletUtils.getPublicAddress(EncryptionType.Ed25519, "testkey");
  expect(value).toBe("01testkey");
});

test(("casper-wallet-utils.secp256k1"), async () => {
  let value = CasperWalletUtils.getPublicAddress(EncryptionType.Secp256k1, "testkey");
  expect(value).toBe("02testkey");
});