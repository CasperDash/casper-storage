import { HDKeyManagerFactory } from "../../bips/bip32";
import { IHDKey } from "../../bips/bip32/hdkey/core";
import { EncryptionType } from "../../cryptography";
import { TypeUtils, Hex } from "../../utils";
import { IHDWallet, IWallet, IWalletConstructor, CoinPath } from "../../wallet/core";

/**
 * Hierarchical Deterministic Wallets (BIP32)
 * Standard for deterministic wallets that can be interchanged between different clients.
 */
export abstract class HDWallet<TWallet extends IWallet<IHDKey>> implements IHDWallet<TWallet> {

  protected walletConstructor: IWalletConstructor<TWallet>;

  protected masterSeed: Uint8Array;
  protected encryptionType: EncryptionType;
  protected coinPath: CoinPath;

  private _masterKey: IHDKey;

  constructor(walletConstructor: IWalletConstructor<TWallet>, coinPath: CoinPath, encryptionType: EncryptionType, masterSeed: Hex) {
    if (!walletConstructor) {
      throw new Error("The wallet constructor must be provided");
    }
    if (!coinPath) {
      throw new Error("The base coint path must be provided"); 
    }
    if (encryptionType == null || (encryptionType !== EncryptionType.Ed25519 && encryptionType !== EncryptionType.Secp256k1)) {
      throw new Error("The encryption type must be provided (e.g: EncryptionType.Ed25519 or EncryptionType.Secp256k1)"); 
    }

    this.walletConstructor = walletConstructor;
    this.coinPath          = coinPath;
    this.encryptionType    = encryptionType;

    this.masterSeed = TypeUtils.parseHexToArray(masterSeed);
    this.getHDKeyManager().verifySeed(this.masterSeed);
  }

  public getEncryptionType(): EncryptionType {
    return this.encryptionType;
  }
  
  public getCoinPath(): CoinPath {
    return this.coinPath;
  }

  public getMasterKey() {
    if (!this._masterKey) {
      this._masterKey = this.getHDKeyManager().fromMasterSeed(this.masterSeed);
    }
    return this._masterKey;
  }

  public getMasterWallet(): Promise<TWallet> {
    return this.getWalletFromPath("m");
  }

  public getAccount(index: number, internal?: boolean): Promise<TWallet> {
    return this.getWalletFromPath(this.coinPath.createPath(index, internal));
  }

  public getWallet(accountIndex: number, internal: boolean, walletIndex: number): Promise<TWallet> {
    if (walletIndex === null || walletIndex === undefined) {
      walletIndex  = accountIndex;
      accountIndex = 0;
    }
    return this.getWalletFromPath(this.coinPath.createPath(accountIndex, internal, walletIndex));
  }

  public async getWalletFromPath(path: string): Promise<TWallet> {
    const hdKey = await this.getMasterKey().derive(path);
    return Promise.resolve(new this.walletConstructor(hdKey, this.encryptionType));
  }

  /**
   * Get the HD key manager
   * @returns 
   */
  private getHDKeyManager() {
    return HDKeyManagerFactory.getInstance(this.encryptionType);
  }

}