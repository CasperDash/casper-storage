import { IHDKey } from "../bips/bip32";
import { CasperHDWallet, DEFAULT_COINT_PATH, IHDWallet, IWallet, Wallet } from "../wallet";
import { EncryptionType, AESUtils, EncryptionResult } from "../cryptography";
import { IUser, IUserOptions } from "./core";
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info";
import { Hex } from "../utils";
import { defaultValidator, IPasswordValidator, PasswordOptions } from "../cryptography/password-options";

/**
 * A user instance to manage HD wallet and legacy wallets with detailed information.
 * A user serialized value is secured by a secured password which is given by user.
 * We should never store user's password but its encrypted one to do extra actions.
 */
export class User implements IUser {

  /**
   * Deserialize user information to an instance of user
   * @param password
   * @param userEncryptedInfo
   * @param options Options to work with user's instance
   * @returns
   */
  public static async deserializeFrom(
    password: string,
    userEncryptedInfo: string,
    options?: Partial<IUserOptions>
  ): Promise<User> {
    const user = new User(password, options);
    await user.deserialize(userEncryptedInfo);
    return user;
  }

  /**
   * Secret password (encrypted from user's password).
   * To serialize/deserialize the wallet information
   */
  private _pwdOptions: PasswordOptions;
  private _passwordValidator: IPasswordValidator;

  private _hdWalletInfo: HDWalletInfo;
  private _legacyWallets: WalletInfo[];

  private _underlyingHDWallet: IHDWallet<Wallet>;

  private _hdWalletPathTemplate: string;

  /**
   * Initialize a new user instnace
   * @param password a secure password to encrypt/decrypt user's data
   * @param options Options to work with user's instance
   * @param hdWalletPathTemplate Option to define a custom derivation path of HD wallet (default is m/PURPOSE'/COINT_TYPE'/INDEX')
   */
  constructor(
    password: string,
    options?: Partial<IUserOptions>,
    hdWalletPathTemplate?: string
  ) {
    options = options || {};

    this._passwordValidator = options.passwordValidator || defaultValidator;
    this.validatePassword(password);

    this._pwdOptions = new PasswordOptions(password);
    this._hdWalletPathTemplate = hdWalletPathTemplate || DEFAULT_COINT_PATH;
  }

  /**
   * Update password to serialize user's information.
   * A new salt will be generated regardless the given options.
   * @param password
   */
  public async updatePassword(password: string) {
    const keyPhrase = this._hdWalletInfo ? await this.decrypt(this._hdWalletInfo.encryptedKeyPhrase) : null;

    this.validatePassword(password);
    this._pwdOptions = new PasswordOptions(password);

    if (keyPhrase) this._hdWalletInfo.encryptedKeyPhrase = await this.encrypt(keyPhrase);
  }

  public async setHDWallet(keyPhrase: string, encryptionType: EncryptionType) {
    if (!keyPhrase) throw new Error("Key is required");
    if (!encryptionType) throw new Error("Type is required");

    this._hdWalletInfo = new HDWalletInfo(keyPhrase, encryptionType, this._hdWalletPathTemplate);
    this._hdWalletInfo.encryptedKeyPhrase = await this.encrypt(keyPhrase);
    this._underlyingHDWallet = null;
  }

  public getHDWallet(): HDWalletInfo {
    return this._hdWalletInfo;
  }

  public async getHDWalletKeyPhrase(): Promise<string> {
    return await this.decrypt(this._hdWalletInfo.encryptedKeyPhrase);
  }

  public getWalletAccount(index: number): Promise<IWallet<IHDKey>> {
    return this.getWallet().getAccount(index);
  }

  public getWalletAccountByRefKey(idOrPath: string): Promise<IWallet<IHDKey>> {
    return this.getWallet().getWalletFromPath(idOrPath);
  }

  public async addWalletAccount(
    index: number,
    info?: WalletDescriptor
  ): Promise<IWallet<IHDKey>> {
    const acc = await this.getWalletAccount(index);
    this.setHDWalletAccount(acc.getReferenceKey(), info);
    return this.getWalletAccount(index);
  }

  async removeWalletAccount(index: number) {
    const acc = await this.getWalletAccount(index);
    this._hdWalletInfo.removeDerivedWallet(acc.getReferenceKey());
  }

  public addLegacyWallet(wallet: IWallet<Hex>, info?: WalletDescriptor) {
    if (!this._legacyWallets) this._legacyWallets = [];

    const id = wallet.getReferenceKey();
    if (!info) {
      info = new WalletDescriptor("Legacy wallet " + (this._legacyWallets.length + 1));
    }

    // Try removing existing wallet
    this.removeWalletInfo(id);

    // Initialize and add new wallet
    const walletInfo = new WalletInfo(id, wallet.getEncryptionType(), info);
    this._legacyWallets.push(walletInfo);
  }

  public getLegacyWallets(): WalletInfo[] {
    return this._legacyWallets;
  }

  public hasLegacyWallets(): boolean {
    return this._legacyWallets && this._legacyWallets.length > 0;
  }

  public hasHDWallet(): boolean {
    return !!this.getHDWallet();
  }

  public setWalletInfo(
    id: string,
    info: string | WalletDescriptor
  ) {
    let walletInfo = this.getWalletInfo(id);
    if (!walletInfo) {

      // The wallet does not exist yet, if the given id is a derived path of HD wallet
      // Automatically create one and insert it into the list
      if (this.isHDWalletPath(id) && this.hasHDWallet()) {
        this.setHDWalletAccount(id);
        walletInfo = this.getWalletInfo(id);
      }

      if (!walletInfo) {
        throw new Error(`The requesting wallet is not available ${id}`);
      }
    }
    walletInfo.descriptor = WalletDescriptor.from(info);
  }

  public getWalletInfo(id: string): WalletInfo {
    let info: WalletInfo = null;

    // Start with HD wallet (as we should in this mode instead of legacy)
    if (this._hdWalletInfo) {
      const derives = this._hdWalletInfo.derivedWallets;
      if (derives) {
        info = derives.find(x => x.id === id || x.uid === id);
      }
    }

    // No available HD wallet for given id, try with legacy ones
    if (!info) {
      if (this._legacyWallets) {
        info = this._legacyWallets.find(x => x.id === id || x.uid === id);
      }
    }

    return info;
  }

  public removeWalletInfo(id: string): void {
    // Start with HD wallet (as we should in this mode instead of legacy)
    if (this._hdWalletInfo) {
      const derives = this._hdWalletInfo.derivedWallets;
      if (derives) {
        const idx = derives.findIndex(x => x.id === id || x.uid === id);
        if (idx >= 0) {
          derives.splice(idx, 1);
          return;
        }
      }
    }

    if (this._legacyWallets) {
      const idx = this._legacyWallets.findIndex(x => x.id === id || x.uid === id);
      if (idx >= 0) {
        this._legacyWallets.splice(idx, 1);
      }
    }
  }

  /**
   * Serializes the wallet and encrypts it with the password.
   * @returns The encrypted wallet.
   */
  public async serialize(): Promise<string> {
    const obj = {
      hdWallet: this.getHDWallet(),
      legacyWallets: this.getLegacyWallets(),
    };

    const resultAsJSON = JSON.stringify(obj);
    const result = await this.encrypt(resultAsJSON);
    return result;
  }

  /**
   * Deserializes the serialized and encrypted user information to merge back the current user instance.
   * @param {string} value - serialized user information
   */
  public async deserialize(value: string): Promise<void> {
    let decryptedValue: string;
    try {
      decryptedValue = await this.decrypt(value);
    } catch (err) {
      throw new Error(`Unable to decrypt user information. Error: ${err}`);
    }

    try {
      const obj = JSON.parse(decryptedValue);
      if (obj.hdWallet) {
        let keyPhrase = obj.hdWallet.keyPhrase;
        if (!keyPhrase && obj.hdWallet.encryptedKeyPhrase) {
          keyPhrase = await this.decrypt(obj.hdWallet.encryptedKeyPhrase);
        }
        if (!keyPhrase) {
          throw new Error(`Unable to find a vaid key-phrase to process HD wallet`);
        }

        this._hdWalletPathTemplate = obj.hdWallet.pathTemplate || DEFAULT_COINT_PATH;

        await this.setHDWallet(keyPhrase, obj.hdWallet.encryptionType);

        if (obj.hdWallet.derives) {
          obj.hdWallet.derives.forEach((wl: WalletInfo) => {
            this.setHDWalletAccount(wl.id, wl.descriptor);
          });
        }
      }

      if (obj.legacyWallets) {
        this._legacyWallets = [];
        obj.legacyWallets.forEach((wl: WalletInfo) => {
          this._legacyWallets.push(
            new WalletInfo(wl.id, wl.encryptionType, wl.descriptor)
          );
        });
      }
    } catch (err) {
      throw new Error(`Unable to parse user information. Error: ${err}. Value: ${decryptedValue}`);
    }
  }

  public async encrypt(value: string): Promise<string> {
    const encryption = await AESUtils.encrypt(this._pwdOptions.password, value);
    return encryption.toString();
  }

  public decrypt(value: string): Promise<string> {
    const encryptedValue = EncryptionResult.parseFrom(value);
    return AESUtils.decrypt(this._pwdOptions.password, encryptedValue.value, encryptedValue.salt, encryptedValue.iv);
  }

  private getWallet(): IHDWallet<IWallet<IHDKey>> {
    if (!this._hdWalletInfo) {
      return null;
    }

    if (!this._underlyingHDWallet) {
      this._underlyingHDWallet = new CasperHDWallet(
        this._hdWalletInfo.keySeed,
        this._hdWalletInfo.pathTemplate,
        this._hdWalletInfo.encryptionType
      ); // ! Hardcoded to Casper for now
    }

    return this._underlyingHDWallet;
  }

  private setHDWalletAccount(id: string, info?: WalletDescriptor) {
    this._hdWalletInfo.setDerivedWallet(
      id,
      this.getHDWallet().encryptionType,
      info
    );
  }

  /**
  * Check if the given id belongs to a HD wallet.
  * The id of a HD wallet should be a path
  * @param id 
  * @returns 
  */
  private isHDWalletPath(id: string) {
    return id.indexOf('/') >= 0;
  }

  /**
   * Confirms the given password matches requirements
   * @param password
   */
  private validatePassword(password: string) {
    const validator = this._passwordValidator;

    if (validator.validatorFunc) {
      const result = validator.validatorFunc(password);
      
      if (!result) {
        throw new Error("The password validator failed to run");
      }
      
      if (!result.status) {
        throw new Error(result.message);
      }
    }

    if (validator.validatorRegex) {
      if (!new RegExp(validator.validatorRegex).test(password)) {
        throw new Error("Password is not strong enough");
      }
    }
  }

}
