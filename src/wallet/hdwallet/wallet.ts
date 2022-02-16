import { IHDKey } from "@/bips/bip32/hdkey";
import { BaseWallet } from "../core/base-wallet";

/**
 * Provide detail implementation for a wallet which is a derivation from a HD wallet
 */
export class Wallet extends BaseWallet<IHDKey> {
  public getPrivateKeyByteArray(): Uint8Array {
    return this.key.getPrivateKey();
  }

  public getPublicKeyByteArray(): Promise<Uint8Array> {
    return this.key.getPublicKey();
  }
}