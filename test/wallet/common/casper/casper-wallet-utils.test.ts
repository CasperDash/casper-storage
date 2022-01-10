import { EncryptionType } from "@/cryptography";
import { CasperWalletUtils } from "@/wallet/common/casper/casper-wallet-utils";

test(("casper-wallet-utils.ed25519"), async () => {
  let value = CasperWalletUtils.getAddress(EncryptionType.Ed25519, "testkey");
  expect(value).toBe("01testkey");
});

test(("casper-wallet-utils.secp256k1"), async () => {
  let value = CasperWalletUtils.getAddress(EncryptionType.Secp256k1, "testkey");
  expect(value).toBe("02testkey");
});