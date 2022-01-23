import { IHDKey } from "@/bips/bip32/hdkey";
import { TypeUtils } from "@/utils";
import { BaseWallet } from "../core/base-wallet";

/**
 * Provide detail implementation for a wallet which is a derivation from a HD wallet
 */
export class Wallet extends BaseWallet<IHDKey> {

  public getPrivateKey(): string {
    return TypeUtils.convertArrayToHexString(this.key.getPrivateKey());
  }

  public async getPublicKey(): Promise<string> {
    const pubKey = await this.key.getPublicKey();
    return TypeUtils.convertArrayToHexString(pubKey);
  }

}