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
  public static deserializeFrom(
    password: string,
    userEncryptedInfo: string,
    options?: Partial<UserOptions>
  ): User {
    const user = new User(password, options);
    user.deserialize(userEncryptedInfo);
    return user;
  }

  /**
   * Secret password (encrypted from user's password).
   * To serialize/deserialize the wallet information
   */
  private password: Password;
  private wallet: HDWalletInfo;
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
    this.updatePassword(
      password,
      options && options.passwordOptions
    );
  }

  /**
   * Update password to serialize user's information
   * @param password
   * @param options
   */
  public updatePassword(
    newPassword: string,
    options?: Partial<PasswordOptions>
  ) {
    this.password = new Password(newPassword, options);
  }

  public setHDWallet(key: string, encryptionType: EncryptionType) {
    if (!key) throw new Error("Key is required");
    if (!encryptionType) throw new Error("Type is required");

    this.wallet = new HDWalletInfo(key, encryptionType);
  }

  public getHDWallet(): HDWalletInfo {
    return this.wallet;
  }

  public async getWalletAccount(index: number): Promise<IWallet<IHDKey>> {
    return await this.getWallet().getAccount(index);
  }

  public async getWalletAccountByRefKey(key: string): Promise<IWallet<IHDKey>> {
    return await this.getWallet().getWalletFromPath(key);
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
    this.wallet.removeDerivedWallet(acc.getReferenceKey());
  }

  public addLegacyWallet(wallet: IWallet<Hex>, info?: WalletDescriptor) {
    if (!this.legacyWallets) this.legacyWallets = [];

    const refKey = wallet.getReferenceKey();
    if (!info) {
      info = new WalletDescriptor("Legacy wallet " + (this.legacyWallets.length + 1));
    }
    const walletInfo = new WalletInfo(refKey, wallet.getEncryptionType(), info);

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
      const isLegacyWallet = this.isLegacyWalletID(id);

      // Not in legacy mode, we should automatically add the wallet account into the list
      if (!isLegacyWallet && this.hasHDWallet()) {
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
    if (this.wallet) {
      const derives = this.wallet.derivedWallets;
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
    if (this.wallet) {
      const derives = this.wallet.derivedWallets;
      if (derives) {
        let idx = derives.findIndex(x => x.id === id || x.uid === id);
        if (idx >= 0) {
          derives.splice(idx, 1);
          return;
        }
      }
    }

    if (this.legacyWallets) {
      for (let i = 0; i < this.legacyWallets.length; i++) {
        let idx = this.legacyWallets.findIndex(x => x.id === id || x.uid === id);
        if (idx >= 0) {
          this.legacyWallets.splice(idx, 1);
        }
      }
    }
  }

  /**
   * Serializes the wallet and encrypts it with the password.
   * @returns The encrypted wallet.
   */
  public serialize(encrypt = true): string {
    const obj = {
      wallet: this.getHDWallet(),
      legacyWallets: this.getLegacyWallets(),
    };

    let result = JSON.stringify(obj);
    if (encrypt) {
      result = AESUtils.encrypt(this.password.getPassword(), result);
    }
    return result;
  }

  /**
   * Deserializes the serialized and encrypted user information to merge back the current user instance.
   * @param {string} value - serialized user information
   * @param {bool} encrypted - the value is encrypted
   */
  public deserialize(value: string, encrypted = true): void {
    let text = value;
    try {
      if (encrypted) {
        text = AESUtils.decrypt(this.password.getPassword(), value);
      }
    } catch (err) {
      throw new Error(`Unable to decrypt user information. Error: ${err}`);
    }

    try {
      if (encrypted) {
        text = AESUtils.decrypt(this.password.getPassword(), value);
      }

      const obj = JSON.parse(text);
      if (obj.wallet) {
        this.wallet = new HDWalletInfo(
          obj.wallet.id,
          obj.wallet.encryptionType
        );

        if (obj.wallet.derives) {
          obj.wallet.derives.forEach((wl: WalletInfo) => {
            this.wallet.setDerivedWallet(
              wl.id,
              wl.encryptionType,
              wl.descriptor
            );
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

  public encrypt(value: string): string {
    return AESUtils.encrypt(this.password.getPassword(), value);
  }

  public decrypt(value: string): string {
    return AESUtils.decrypt(this.password.getPassword(), value);
  }

  private getWallet(): IHDWallet<IWallet<IHDKey>> {
    if (!this.wallet) {
      return null;
    }

    const wallet = new CasperHDWallet(
      this.wallet.keySeed,
      this.wallet.encryptionType
    ); // ! Hardcoded to Casper for now
    return wallet;
  }

  private setHDWalletAccount(refKey: string, info?: WalletDescriptor) {
    this.wallet.setDerivedWallet(
      refKey,
      this.getHDWallet().encryptionType,
      info
    );
  }

  /**
  * Check if the given id belongs to a legacy wallet.
  * The id of a HD wallet should be a path
  * @param id 
  * @returns 
  */
  private isLegacyWalletID(id: string) {
    return id.indexOf('/') < 0;
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
