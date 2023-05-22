import { CoinType } from "./coin-type";
import { Purpose } from "./purpose";

export const DEFAULT_COINT_PATH = "m/PURPOSE'/COINT_TYPE'/INDEX'";
export const DEFAULT_COINT_PATH_ALTER = "m/PURPOSE'/COINT_TYPE'/0'/0/INDEX";

/**
 * Path levels:
 * m / purpose' / coin_type' / account' / change / address_index
 * 
 * Purpose:
 * A const set to 0x8000002C (44) following BIP43
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
   * @param template
   * @param purpose
   * @param coinType 
   */
  constructor(template: string, purpose: Purpose, coinType: CoinType) {
    if (template.indexOf("PURPOSE") <= 0) {
      throw new Error("The template must contain PURPOSE");
    }
    if (template.indexOf("COINT_TYPE") <= 0) {
      throw new Error("The template must contain COINT_TYPE");
    }
    if (template.indexOf("INDEX") <= 0) {
      throw new Error("The template must contain INDEX");
    }

    template = template.replace("PURPOSE", String(purpose));
    template = template.replace("COINT_TYPE", String(coinType));

    this._path = template;
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
   * @param idx 
   * @returns 
   */
  public createPath(idx: number): string {
    const path = this._path.replace("INDEX", String(idx || 0));
    return path;
  }

}