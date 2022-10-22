import { Hex, TypeUtils } from "../../utils";
import { BaseWallet } from "../core/base-wallet";

/**
 * Provide detail implementation for a legacy wallet which works with a single private key
 */
export class LegacyWallet extends BaseWallet<Hex> {

  private _publicKey: Uint8Array;

  public getReferenceKey(): string {
    return this.getPrivateKey();
  }

  public getPrivateKeyByteArray(): Uint8Array {
    return TypeUtils.parseHexToArray(this.getKey());
  }

  public async getRawPublicKeyByteArray(): Promise<Uint8Array> {
    if (!this._publicKey) {
      this._publicKey = await this.getAsymmetricKey().createPublicKey(this.getPrivateKey(), true);
    }
    return this._publicKey;
  }

}