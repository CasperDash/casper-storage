/** ! Entrypoint of browser builds */
export * from "./index";

import { TypeUtils } from "./index";
import { KeyFactory, KeyParser } from "./index";
import { EncryptionType, CryptoUtils, AESUtils, EncoderUtils } from "./index";
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
  EncoderUtils,
  KeyParser,

  // Wallets
  CasperWallet,
  CasperHDWallet,
  CasperLegacyWallet,

  User,
  StorageManager
}

register.CasperStorage = CasperStorage;