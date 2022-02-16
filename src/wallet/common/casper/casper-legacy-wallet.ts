import { LegacyWallet } from "@/wallet/legacywallet/legacy-wallet";
import { CasperWalletUtils } from "./casper-wallet-utils";

export class CasperLegacyWallet extends LegacyWallet {

  /**
   * Get the public address of current wallet
   */
  public async getPublicAddress(): Promise<string> {
    const pubKey = await this.getPublicKey();
    return CasperWalletUtils.getPublicAddress(this.encryptionType, pubKey);
  }

}