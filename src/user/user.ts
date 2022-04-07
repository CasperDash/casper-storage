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
    const refKey = wallet.getReferenceKey();
    const walletInfo = new WalletInfo(refKey, wallet.getEncryptionType(), info);

    if (!this.legacyWallets) this.legacyWallets = [];
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
    info: string | WalletDescriptor,
    legacyWallet?: boolean
  ) {
    let walletInfo = this.getWalletInfo(id, legacyWallet);
    if (!walletInfo) {
      // Not in legacy mode, we should automatically add the wallet account into the list
      if (!legacyWallet && this.hasHDWallet()) {
        this.setHDWalletAccount(id);
        walletInfo = this.getWalletInfo(id, legacyWallet);
      }
      if (!walletInfo) {
        throw new Error(`The requesting wallet is not available ${id}`);
      }
    }
    walletInfo.descriptor = WalletDescriptor.from(info);
  }

  public getWalletInfo(id: string, legacyWallet?: boolean): WalletInfo {
    let info: WalletInfo = null;
    if (legacyWallet === true) {
      if (this.legacyWallets) {
        info = this.legacyWallets.filter((x) => x.key == id)[0];
      }
    } else {
      if (this.wallet) {
        const derives = this.wallet.derivedWallets;
        if (derives) {
          info = derives.filter((x) => x.key == id)[0];
        }
      }
    }
    return info;
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
   * @param {string} value - string
   */
  public deserialize(value: string) {
    const text = AESUtils.decrypt(this.password.getPassword(), value);
    try {
      const obj = JSON.parse(text);
      if (obj.wallet) {
        this.wallet = new HDWalletInfo(
          obj.wallet.key,
          obj.wallet.encryptionType
        );

        if (obj.wallet.derives) {
          obj.wallet.derives.forEach((wl: WalletInfo) => {
            this.wallet.setDerivedWallet(
              wl.key,
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
            new WalletInfo(wl.key, wl.encryptionType, wl.descriptor)
          );
        });
      }
    } catch {
      throw new Error("Password is invalid");
    }
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
