import { CryptoUtils } from "../../../cryptography";
import { TypeUtils } from "../../../utils";
import { HDKey } from "./hd-key";

export class HDKeyED25519 extends HDKey {

  /**
   * It creates a new HDKeyED25519 object.
   * @param {Uint8Array} privateKey - The private key.
   * @param {Uint8Array} chainCode - The chain code is a 32-byte sequence that is used to derive child keys.
   * @param {Uint8Array} publicKey - The public key of the new HDKey.
   * @returns An HDKeyED25519 object.
   */
  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) {
    return new HDKeyED25519(this.config, privateKey, chainCode, publicKey);
  }

  /**
   * Create a new HDKey from the current HDKey and the provided index
   * @param {number} index - The index of the child key to derive.
   * @returns An HDKey object.
   */
  protected deriveChild(index: number): Promise<HDKey> {
    const privateKey = this.getPrivateKey();
    if (!privateKey) {
      throw new Error("Cannot derive a hardened child without private key")
    }

    // data = 0x00 || ser256(kpar) || ser32(index)
    const data = TypeUtils.concatBytes(TypeUtils.getBytesOfZero(), privateKey, TypeUtils.convertU32ToBytes(index));

    const { key, chainCode } = CryptoUtils.digestSHA512(data, this.getChainCode());
    return this.createChildHDKey(index, key, chainCode, null);
  }

  /**
   * It creates a public key from the private key.
   * @returns The public key.
   */
  async getPublicKey(): Promise<Uint8Array> {
    if (!this.publicKey) {
      const publicKey = await this.getKeyFactory().createPublicKey(this.privateKey, true);
      this.publicKey = TypeUtils.concatBytes(TypeUtils.getBytesOfZero(), publicKey);
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