import { IHDKey } from "../bips/bip32";
import { CasperHDWallet, IHDWallet, IWallet } from "../wallet";
import { EncryptionType, AESUtils } from "../cryptography";
import { IUser, PasswordOptions, UserOptions } from "./core";
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info";
import { Hex } from "../utils";
import { Password } from "./password";

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
    options?: Partial<UserOptions>
  ): Promise<User> {
    const user = new User(password, options);
    await user.deserialize(userEncryptedInfo);
    return user;
  }

  /**
   * Secret password (encrypted from user's password).
   * To serialize/deserialize the wallet information
   */
  private password: Password;
  private hdWallet: HDWalletInfo;
  private legacyWallets: WalletInfo[];

  /**
   * Initialize a new user instnace
   * @param password a secure password to encrypt/decrypt user's data
   * @param options Options to work with user's instance
   */

  constructor(
    password: string,
    options?: Partial<UserOptions>
  ) {
    this.password = new Password(password, options && options.passwordOptions);
  }

  /**
   * Update password to serialize user's information.
   * A new salt will be generated regardless the given options.
   * @param newPassword
   * @param options
   */
  public updatePassword(
    newPassword: string,
    options?: Partial<PasswordOptions>
  ) {

    // Force to generate a new salt
    if (options) {
      options.salt = null;
    }

    this.password = new Password(newPassword, options);
  }

  public setHDWallet(keyPhrase: string, encryptionType: EncryptionType) {
    if (!keyPhrase) throw new Error("Key is required");
    if (!encryptionType) throw new Error("Type is required");

    this.hdWallet = new HDWalletInfo(keyPhrase, encryptionType);
  }

  public getHDWallet(): HDWalletInfo {
    return this.hdWallet;
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
    this.hdWallet.removeDerivedWallet(acc.getReferenceKey());
  }

  public addLegacyWallet(wallet: IWallet<Hex>, info?: WalletDescriptor) {
    if (!this.legacyWallets) this.legacyWallets = [];

    const id = wallet.getReferenceKey();
    if (!info) {
      info = new WalletDescriptor("Legacy wallet " + (this.legacyWallets.length + 1));
    }

    // Try removing existing wallet
    this.removeWalletInfo(id);

    // Initialize and add new wallet
    const walletInfo = new WalletInfo(id, wallet.getEncryptionType(), info);
    this.legacyWallets.push(walletInfo);
  }

  public getLegacyWallets(): WalletInfo[] {
    return this.legacyWallets;
  }

  public hasLegacyWallets(): boolean {
    return this.legacyWallets && this.legacyWallets.length > 0;
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
    if (this.hdWallet) {
      const derives = this.hdWallet.derivedWallets;
      if (derives) {
        info = derives.find(x => x.id === id || x.uid === id);
      }
    }

    // No available HD wallet for given id, try with legacy ones
    if (!info) {
      if (this.legacyWallets) {
        info = this.legacyWallets.find(x => x.id === id || x.uid === id);
      }
    }

    return info;
  }

  public removeWalletInfo(id: string): void {
    // Start with HD wallet (as we should in this mode instead of legacy)
    if (this.hdWallet) {
      const derives = this.hdWallet.derivedWallets;
      if (derives) {
        const idx = derives.findIndex(x => x.id === id || x.uid === id);
        if (idx >= 0) {
          derives.splice(idx, 1);
          return;
        }
      }
    }

    if (this.legacyWallets) {
      const idx = this.legacyWallets.findIndex(x => x.id === id || x.uid === id);
      if (idx >= 0) {
        this.legacyWallets.splice(idx, 1);
      }
    }
  }

  /**
   * Serializes the wallet and encrypts it with the password.
   * @returns The encrypted wallet.
   */
  public async serialize(encrypt = true): Promise<string> {
    const obj = {
      hdWallet: this.getHDWallet(),
      legacyWallets: this.getLegacyWallets(),
    };

    let result = JSON.stringify(obj);
    if (encrypt) {
      result = await this.encrypt(result);
    }
    return result;
  }

  /**
   * Deserializes the serialized and encrypted user information to merge back the current user instance.
   * @param {string} value - serialized user information
   * @param {bool} encrypted - the value is encrypted
   */
  public async deserialize(value: string, encrypted = true): Promise<void> {
    let text = value;
    try {
      if (encrypted) {
        text = await this.decrypt(value);
      }
    } catch (err) {
      throw new Error(`Unable to decrypt user information. Error: ${err}`);
    }

    try {
      const obj = JSON.parse(text);
      if (obj.hdWallet) {
        this.setHDWallet(obj.hdWallet.keyPhrase, obj.hdWallet.encryptionType);

        if (obj.hdWallet.derives) {
          obj.hdWallet.derives.forEach((wl: WalletInfo) => {
            this.setHDWalletAccount(wl.id, wl.descriptor);
          });
        }
      }

      if (obj.legacyWallets) {
        this.legacyWallets = [];
        obj.legacyWallets.forEach((wl: WalletInfo) => {
          this.legacyWallets.push(
            new WalletInfo(wl.id, wl.encryptionType, wl.descriptor)
          );
        });
      }
    } catch (err) {
      throw new Error(`Unable to parse user information. Error: ${err}`);
    }
  }

  public encrypt(value: string): Promise<string> {
    return AESUtils.encrypt(this.password.getPassword(), value, this.password.getSalt(), this.password.getSalt());
  }

  public decrypt(value: string): Promise<string> {
    return AESUtils.decrypt(this.password.getPassword(), value, this.password.getSalt(), this.password.getSalt());
  }

  private getWallet(): IHDWallet<IWallet<IHDKey>> {
    if (!this.hdWallet) {
      return null;
    }

    const wallet = new CasperHDWallet(
      this.hdWallet.keySeed,
      this.hdWallet.encryptionType
    ); // ! Hardcoded to Casper for now
    return wallet;
  }

  private setHDWalletAccount(id: string, info?: WalletDescriptor) {
    this.hdWallet.setDerivedWallet(
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

  public getPasswordHashingOptions(): Pick<
    PasswordOptions,
    "salt" | "iterations" | "keySize"
  > {
    return {
      salt: this.password.getSalt(),
      iterations: this.password.getIterations(),
      keySize: this.password.getKeySize(),
    };
  }
}
