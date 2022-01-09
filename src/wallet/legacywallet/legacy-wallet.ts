import { Hex, TypeUtils } from "@/utils";
import { BaseWallet } from "../core/base-wallet";

export class LegacyWallet extends BaseWallet<Hex> {

  public getPrivateKey(): string {
    return TypeUtils.parseHexToString(this.key);
  }

  public async getPublicKey(): Promise<string> {
    const pubKey = await this.getAsymmetricKey().createPublicKey(this.getPrivateKey(), true);
    return TypeUtils.convertArrayToHexString(pubKey);
  }

}