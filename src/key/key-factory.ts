import { IKeyManager } from "../key/core";
import { MnemonicKey } from "../key/mnemonic";

/**
 * The factory to provide an instance of master key generator.
 * Usage: KeyFactory.getInstance(), returns a default instance of Mnemoic key generator
 */
export class KeyFactory {

  /**
   * Get an instance of the key manager to generate/validate keys.
   * Default will be mnemonic-key manager
   * @returns 
   */
  static getInstance(): IKeyManager {
    return new MnemonicKey();
  }
}