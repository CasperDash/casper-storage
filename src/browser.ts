/** ! Entrypoint of browser builds */
export * from "./index";

import { TypeUtils } from "./index";
import { KeyFactory } from "./index";
import { EncryptionType, CryptoUtils } from "./index";
import { CasperWallet, CasperHDWallet, CasperLegacyWallet } from "./index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const register = (window as any);

const CasperStorage = {
  // Utilities
  TypeUtils,

  // Key - mnemophic
  KeyFactory,

  // crypto
  EncryptionType,
  CryptoUtils,

  // Wallets
  CasperWallet,
  CasperHDWallet,
  CasperLegacyWallet
}

register.CasperStorage = CasperStorage;