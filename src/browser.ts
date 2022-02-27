/** ! Entrypoint of browser builds */
export * from "./index";

import { TypeUtils } from "./index";
import { KeyFactory } from "./index";
import { EncryptionType, CryptoUtils, AESUtils } from "./index";
import { CasperWallet, CasperHDWallet, CasperLegacyWallet } from "./index";
import { User, StorageManager } from "./index";

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
  AESUtils,

  // Wallets
  CasperWallet,
  CasperHDWallet,
  CasperLegacyWallet,

  User,
  StorageManager
}

register.CasperStorage = CasperStorage;