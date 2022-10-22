import { EncryptionType, AsymmetricKeyFactory, CryptoUtils, EncoderUtils } from "../../cryptography";
import { TypeUtils } from "../../utils";
import { IWallet } from "../core";

export abstract class BaseWallet<TKey> implements IWallet<TKey> {

  /**
   * The key instance
   */
   private key: TKey;

  /**
   * The encryption type
   */
  private encryptionType: EncryptionType;

  constructor(key: TKey, encryptionType: EncryptionType) {
    this.key = key;
    this.encryptionType = encryptionType;
  }

  /**
   * Returns the private key as byte-array
   */
  public abstract getPrivateKeyByteArray(): Uint8Array;

  /**
   * Returns the raw public key as byte-array
   */
  public abstract getRawPublicKeyByteArray(): Promise<Uint8Array>;

  /**
   * Returns the formated public key as byte-array
   */
  public async getPublicKeyByteArray(): Promise<Uint8Array> {
    const key = await this.getPublicKey();
    return TypeUtils.convertHexStringToArray(key);
  }
  
  /**
   * Returns the public address as byte-array
   */
  public async getPublicAddressByteArray(): Promise<Uint8Array> {
    const key = await this.getPublicAddress();
    return TypeUtils.convertHexStringToArray(key);
  }

  /**
   * Returns the key of wallet
   * @returns 
   */
  public getKey(): TKey {
    return this.key;
  }

  /**
   * Returns the refrence key of wallet
   * either a private key for legacy wallet or derived path of sub-wallet of HD wallet
   */
  public abstract getReferenceKey(): string;

  /**
   * Returns the encryption type of wallet
   * @returns 
   */
  public getEncryptionType(): EncryptionType {
    return this.encryptionType;
  }

  /**
   * Returns the private key of wallet
   */
  public getPrivateKey(): string {
    return TypeUtils.convertArrayToHexString(this.getPrivateKeyByteArray());
  }

  /**
   * Returns the raw public key of wallet
   */
  public async getRawPublicKey(): Promise<string> {
    const publicKey = await this.getRawPublicKeyByteArray();
    return TypeUtils.convertArrayToHexString(publicKey);
  }

  /**
   * Returns the formated public address of wallet
   */
  public async getPublicKey(): Promise<string> {
    const publicKey = await this.getRawPublicKey();
    return TypeUtils.convertArrayToHexString(CryptoUtils.hash160(TypeUtils.convertHexStringToArray(publicKey)));
  }

  /**
   * Returns the public hash of wallet
   */
  public async getPublicAddress(): Promise<string> {
    const addr = await this.getRawPublicKeyByteArray();
    const separator = new Uint8Array([0]);
    const data = new Uint8Array([...EncoderUtils.encodeText(this.getEncryptionType()), ...separator, ...addr]);
    return TypeUtils.convertArrayToHexString(CryptoUtils.blake2bHash(data));
  }

  public getPrivateKeyInPEM(): string {
    return this.getAsymmetricKey().getKeyInPEM(this.getPrivateKeyByteArray(), true);
  }

  protected getAsymmetricKey() {
    return AsymmetricKeyFactory.getInstance(this.getEncryptionType());
  }
}