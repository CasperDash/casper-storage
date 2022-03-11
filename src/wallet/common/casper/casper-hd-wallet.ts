import { EncryptionType } from "@/cryptography";
import { CoinPath, CoinType, Purpose } from "@/wallet/core";
import { Wallet, HDWallet } from "@/wallet";
import { Hex } from "@/utils";
import { CasperWalletUtils } from "./casper-wallet-utils";

/**
 * Casper wallet implementation
 */
export class CasperWallet extends Wallet {

  /**
   * Get the public address of current wallet
   */
  public async getPublicAddress(): Promise<string> {
    let pubKey = await this.getPublicKey();
    if (this.getEncryptionType() === EncryptionType.Ed25519) {
      // ! Casper doesn't use 00 prefix as standard SLIP-0010
      pubKey = pubKey.slice(2);
    }
    return CasperWalletUtils.getPublicAddress(this.getEncryptionType(), pubKey);
  }

}

/**
 * Casper HD wallet implementation, purpose 44 and using coin-type Casper (506)
 */
export class CasperHDWallet extends HDWallet<CasperWallet> {

  private static PATH = new CoinPath(Purpose.BIP44, CoinType.Casper);

  constructor(masterSeed: Hex, encryptionType: EncryptionType = EncryptionType.Ed25519) {
    super(CasperWallet, CasperHDWallet.PATH, encryptionType, masterSeed);
  }

}