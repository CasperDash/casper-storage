import { EncryptionType, AsymmetricKeyFactory } from "@/cryptography";
import { IWallet } from "../core";

export abstract class BaseWallet<TKey> implements IWallet<TKey> {

  /**
   * The key instance
   */
  key: TKey;

  /**
   * The encryption type
   */
  encryptionType: EncryptionType;

  constructor(key: TKey, encryptionType: EncryptionType) {
    this.key = key;
    this.encryptionType = encryptionType;
  }

  /**
   * Returns the private key of wallet
   */
  public abstract getPrivateKey(): string;

  /**
   * Returns the public key of wallet
   */
  public abstract getPublicKey(): Promise<string>;

  /**
   * Returns the public address of wallet
   */
  public getAccountAddress(): Promise<string> {
    return this.getPublicKey();
  }

  /**
   * 
   * @param message 
   * @returns 
   */
  public sign(message: Uint8Array): Promise<Uint8Array> {
    return this.getAsymmetricKey().sign(this.getPrivateKey(), message);
  }

  protected getAsymmetricKey() {
    return AsymmetricKeyFactory.getInstance(this.encryptionType);
  }
}