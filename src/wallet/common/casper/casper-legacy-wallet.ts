import { LegacyWallet } from "../../../wallet/legacywallet/legacy-wallet";
import { CasperWalletUtils } from "./casper-wallet-utils";

export class CasperLegacyWallet extends LegacyWallet {

  /**
   * Get the public address of current wallet
   */
  public async getPublicKey(): Promise<string> {
    const publicKey = await this.getRawPublicKey();
    return CasperWalletUtils.getPublicAddress(this.getEncryptionType(), publicKey);
  }

}