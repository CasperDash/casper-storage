import { Hex, TypeUtils } from "@/utils";
import { BaseWallet } from "../core/base-wallet";

/**
 * Provide detail implementation for a legacy wallet which works with a single private key
 */
export class LegacyWallet extends BaseWallet<Hex> {

  public getReferenceKey(): string {
    return this.getPrivateKey();
  }

  public getPrivateKeyByteArray(): Uint8Array {
    return TypeUtils.parseHexToArray(this.getKey());
  }

  public async getPublicKeyByteArray(): Promise<Uint8Array> {
    const pubKey = await this.getAsymmetricKey().createPublicKey(this.getPrivateKey(), true);
    return pubKey;
  }

}