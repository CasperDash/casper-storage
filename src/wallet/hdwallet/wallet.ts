import { IHDKey } from "../../bips/bip32/hdkey/core";
import { BaseWallet } from "../core/base-wallet";

/**
 * Provide detail implementation for a wallet which is a derivation from a HD wallet
 */
export class Wallet extends BaseWallet<IHDKey> {

  private _publicKey: Uint8Array;

  public getReferenceKey(): string {
    return this.getKey().getPath();
  }

  public getPrivateKeyByteArray(): Uint8Array {
    return this.getKey().getPrivateKey();
  }

  public async getRawPublicKeyByteArray(): Promise<Uint8Array> {
    if (!this._publicKey) {
      this._publicKey = await this.getKey().getPublicKey();
    }
    return this._publicKey;
  }

}