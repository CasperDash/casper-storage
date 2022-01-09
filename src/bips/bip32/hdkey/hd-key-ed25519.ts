import { HDKey } from "./hd-key";

const ZERO_BYTES = new Uint8Array([0]);

export class HDKeyED25519 extends HDKey {

  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) {
    return new HDKeyED25519(this.config, privateKey, chainCode, publicKey);
  }

  protected deriveChild(index: number): Promise<HDKey> {
    const prKey = this.getPrivateKey();
    // data = 0x00 || ser256(kpar) || ser32(index)
    const ab = new ArrayBuffer(1 + prKey.byteLength + 4);
    const view = new DataView(ab);

    let bIndex = 0;
    view.setUint8(0, bIndex++);
    for (let i = 0; i < prKey.byteLength; i++) {
      view.setInt8(bIndex++, prKey[i]);
    }
    view.setUint32(bIndex++, index);

    const data = new Uint8Array(ab);
    return this.createChildHDKeyFromData(index, data);
  }

  /**
   * Returns the public key Uint8Array
   * @returns 
   */
  async getPublicKey(): Promise<Uint8Array> {
    if (!this.publicKey) {
      const publicKey = await this.getKeyFactory().createPublicKey(this.privateKey, true);
      this.publicKey = new Uint8Array([...ZERO_BYTES, ...publicKey]);
    }
    return Promise.resolve(this.publicKey);
  }

  /**
   * Following SLIP 0010 - ed only supports harden paths
   * @param index 
   * @returns 
   */
  getHardenedIndex(index: number): number {
    index += this.getHardenedOffset();
    return index;
  }

}