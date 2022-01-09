import { IKeyMangerConfig, IKeyManager } from "@/key/core";
import { MnemonicKey } from "@/key/mnemonic";

/**
 * The factory to provide an instance of master key generator.
 * Usage: KeyFactory.getInstance(), returns a default instance of Mnemoic key generator
 */
export class KeyFactory {
  static getInstance(options: Partial<IKeyMangerConfig> = null): IKeyManager {
    return new MnemonicKey(options);
  }
}