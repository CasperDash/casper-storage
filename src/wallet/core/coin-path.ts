import { CoinType } from "./coin-type";
import { Purpose } from "./purpose";

/**
 * Path levels:
 * m / purpose' / coin_type' / account' / change / address_index
 * 
 * Purpose:
 *  A const set to 0x8000002C (44) following BIP43
 * 
 * Coint types:
 *  https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 *  e.g Casper is 0x800001fa, Bitcoin is 0x80000000
 * 
 * Account:
 *  Allows users to organize accounts for different purposes (public as donation account, private as saving account)
 * 
 * Change:
 *  Either 0 to specific external chain, visible outside of the wallet
 *  or 1 to specific internal chain, Invisible and is used for return transaction change
 * 
 * Index:
 *  0-based index in sequentially increasing manner, it is used as child index.
 */
export class CoinPath {
  private _path: string;

  /**
   * Construct a base derivation path
   * @param purpose
   * @param coinType 
   */
  constructor(purpose: Purpose, coinType: CoinType) {
    this._path = `m/${purpose}'/${coinType}'`;
  }

  /**
   * Returns the base derivation path
   */
  public get path() {
    return this._path;
  }

  /**
   * Derive a wallet path from account index, change (external or internal) and wallet index.
   * 
   * @param accountIndex 
   * @param internal 
   * @param walletIndex 
   * @returns 
   */
  public createPath(accountIndex: number, internal?: boolean, walletIndex?: number): string {
    accountIndex = accountIndex || 0;
    if (internal != null) {
      const change = internal ? 1 : 0;
      if (walletIndex != null) {
        return this._path + `/${accountIndex}'/${change}/${walletIndex}`
      } else {
        return this._path + `/${accountIndex}'/${change}`;
      }
    } else {
      return this._path + `/${accountIndex}'`;
    }
  }

}