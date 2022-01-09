import * as bip39 from "@/bips/bip39";
import { IKeyMangerConfig, IKeyManager } from "@/key/core";
import { Hex, TypeUtils } from "@/utils";

/**
 * Wrapper to work with mnemonic
 */
export class MnemonicKey implements IKeyManager {

  /**
   * Default options to work with phrases
   */
  readonly DEFAULT_CONFIG: IKeyMangerConfig = {
    WordsLength: 12,
    Password: null
  }

  /**
   * The initialized options to work with phrases
   */
  cfg: IKeyMangerConfig;

  constructor(cfg: Partial<IKeyMangerConfig> = null) {
    this.cfg = Object.assign(cfg || {}, this.DEFAULT_CONFIG);
  }

  generate(): string {
    const strength = this.cfg.WordsLength === 24 ? 256 : 128; // TODO, flexible from 12-24 words instead of fixed 12 or 24 words
    return bip39.generateMnemonic(strength);
  }

  validate(key: string): boolean {
    return bip39.validateMnemonic(key);
  }

  toEntropy(key: string): string {
    return bip39.mnemonicToEntropy(key);
  }

  toEntropyAsync(key: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toEntropy(key));
    })
  }

  toKey(entropy: Hex): string {
    const key = bip39.entropyToMnemonic(entropy);
    return key;
  }

  toKeyAsync(entropy: Hex): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toKey(entropy));
    });
  }

  toSeed(key: string, password?: string): string {
    const arr = bip39.mnemonicToSeedSync(key, password);
    return TypeUtils.convertArrayToHexString(arr);
  }

  toSeedAsync(key: string, password?: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.toSeed(key, password));
    });
  }

  toSeedArray(key: string, password?: string): Uint8Array {
    return bip39.mnemonicToSeedSync(key, password);
  }

  toSeedArrayAsync(key: string, password?: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      resolve(this.toSeedArray(key, password));
    });
  }

}
