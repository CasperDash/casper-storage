import { IHDKey } from "@/bips/bip32";
import { AESUtils } from "@/cryptography/utils/aes-utils";
import { CasperHDWallet, IHDWallet, IWallet } from "@/wallet";
import { CryptoUtils, EncryptionType, Hex, TypeUtils } from "..";
import { IUser } from "./core";
import { HDWalletInfo, WalletDescriptor, WalletInfo } from "./wallet-info";

/**
 * A user instance to manage HD wallet and legacy wallets with detailed information.
 * A user serialized value is secured by a secured password which is given by user.
 * We should never store user's password but its encrypted one to do extra actions.
 */
export class User implements IUser {
  /**
   * Secret password (encrypted from user's password).
   * To serialize/deserialize the wallet information
   */
  private password: string;
  private wallet: HDWalletInfo;
  private legacyWallets: WalletInfo[];

  constructor(password: string) {
    if (!password) {
      throw new Error("Password is required to work with user information");
    }

    // We should not store the raw password in memory, let's hash it
    this.password = TypeUtils.convertArrayToHexString(CryptoUtils.hash160(CryptoUtils.convertTextToByteArray(password)));
  }

  public setHDWallet(key: string, type: EncryptionType) {
    this.wallet = new HDWalletInfo(key, type);
  }

  public getHDWallet(): HDWalletInfo {
    return this.wallet;
  }

  public async getWalletAccount(index: number): Promise<IWallet<IHDKey>> {
    return await this.getWallet().getAccount(index);
  }

  public async addWalletAccount(index: number, info?: WalletDescriptor) : Promise<IWallet<IHDKey>>{
    const acc = await this.getWallet().getAccount(index);
    this.wallet.setDerive(acc.getReferenceKey(), acc.getEncryptionType(), info);
    return this.getWalletAccount(index);
  }

  async removeWalletAccount(index: number) {
    const acc = await this.getWallet().getAccount(index);
    this.wallet.removeDerive(acc.getReferenceKey());
  }

  public addLegacyWallet(wallet: IWallet<Hex>, info?: WalletDescriptor) {
    const refKey = wallet.getReferenceKey();
    const walletInfo = new WalletInfo(refKey, wallet.getEncryptionType(), info);

    if (!this.legacyWallets) {
      this.legacyWallets = [];
    }
    this.legacyWallets.push(walletInfo);
  }

  public getLegacyWallets(): WalletInfo[] {
    return this.legacyWallets;
  }

  public hasLegacyWallets(): boolean {
    return this.legacyWallets && this.legacyWallets.length > 0;
  }

  public setWalletInfo(id: string, info: string | WalletDescriptor, legacyWallet?: boolean) {
    const walletInfo = this.getWalletInfo(id, legacyWallet);
    if (!walletInfo) {
      throw new Error(`The requesting wallet is not available ${id}`)
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
        const derives = this.wallet.derives;
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
      legacyWallets: this.getLegacyWallets()
    }

    let result = JSON.stringify(obj);
    if (encrypt) {
      result = AESUtils.encrypt(this.password, result);
    }
    return result;
  }

  /**
   * Deserializes the serialized and encrypted user information to merge back the current user instance.
   * @param {string} value - string
   */
  public deserialize(value: string) {
    const text = AESUtils.decrypt(this.password, value);
    const obj = JSON.parse(text);

    if (obj.wallet) {
      this.wallet = new HDWalletInfo(obj.wallet.key, obj.wallet.type);

      if (obj.wallet.derives) {
        obj.wallet.derives.forEach((wl: WalletInfo) => {
          this.wallet.setDerive(wl.key, wl.type, wl.descriptor);
        });
      }
    }

    if (obj.legacyWallets) {
      this.legacyWallets = [];
      obj.legacyWallets.forEach((wl: WalletInfo) => {
        this.legacyWallets.push(new WalletInfo(wl.key, wl.type, wl.descriptor));
      });
    }
  }

  private getWallet(): IHDWallet<IWallet<IHDKey>> {
    if (!this.wallet) {
      return null;
    }

    const masterKey = this.wallet.key;
    const wallet = new CasperHDWallet(masterKey, this.wallet.type); // ! Hardcoded to Casper for now
    return wallet;
  }

}