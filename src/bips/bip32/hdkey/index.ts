export interface IHDKey {

  getPath(): string;

  getFingerprint(): Promise<number>;
  getParentFingerPrint(): number;
  getChainCode(): Uint8Array;
  getPrivateKey(): Uint8Array;

  getPublicKey(): Promise<Uint8Array>;
  getPrivateExtendedKey(): Promise<string>;
  getPublicExtendedKey(): Promise<string>;

  derive(path: string): Promise<IHDKey>;
}