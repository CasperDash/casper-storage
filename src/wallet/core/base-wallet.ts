import { EncryptionType, AsymmetricKeyFactory, CryptoUtils } from "@/cryptography";
import { TypeUtils } from "@/utils";
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

  public abstract getPrivateKeyByteArray(): Uint8Array;

  public abstract getPublicKeyByteArray(): Promise<Uint8Array>;

  /**
   * Returns the private key of wallet
   */
  public getPrivateKey(): string {
    return TypeUtils.convertArrayToHexString(this.getPrivateKeyByteArray());
  }

  public async getPublicKey(): Promise<string> {
    const pubKey = await this.getPublicKeyByteArray();
    return TypeUtils.convertArrayToHexString(pubKey);
  }

  /**
   * Returns the public address of wallet
   */
  public async getPublicAddress(): Promise<string> {
    const publicKey = await this.getPublicKey();
    return TypeUtils.convertArrayToHexString(CryptoUtils.hash160(TypeUtils.convertHexStringToArray(publicKey)));
  }

  /**
   * Returns the public hash of wallet
   */
  public async getPublicHash(): Promise<string> {
    const addr = await this.getPublicKeyByteArray();
    const separator = new Uint8Array([0]);
    const data = new Uint8Array([...CryptoUtils.convertUt8ToByteArray(this.encryptionType), ...separator, ...addr]);
    return TypeUtils.convertArrayToHexString(CryptoUtils.blake2bHash(data));
  }

  /**
   * Sign the message
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