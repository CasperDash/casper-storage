import { HDKey } from "./hd-key";
import { CryptoUtils } from "@/cryptography";

import {
  bytesToHex,
  hexToBytes,
  assertBytes
} from '@noble/hashes/utils';

import * as secp from '@noble/secp256k1';

export class HDKeySecp256k1 extends HDKey {

  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) {
    return new HDKeySecp256k1(this.config, privateKey, chainCode, publicKey);
  }

  protected async deriveChild(index: number): Promise<HDKey> {
    let data: Uint8Array;

    const privateKey = this.getPrivateKey();
    const publicKey = await this.getPublicKey();

    const isHardened = index >= this.getHardenedOffset();
    if (isHardened) {
      // Hardened child
      if (!privateKey) {
        throw new Error("Cannot derive child without private key")
      }

      // data = 0x00 || ser256(kpar) || ser32(index)
      const ab = new ArrayBuffer(1 + privateKey.byteLength + 4);
      const view = new DataView(ab);
      let bIndex = 0;
      view.setUint8(0, bIndex++);
      for (let i = 0; i < privateKey.byteLength; i++) {
        view.setInt8(bIndex++, privateKey[i]);
      }
      view.setUint32(bIndex++, index);

      data = new Uint8Array(ab);
    } else {
      // Normal child
      // data = serP(point(kpar)) || ser32(index)
      //      = serP(Kpar) || ser32(index)
      const ab = new ArrayBuffer(publicKey.byteLength + 4);
      const view = new DataView(ab);
      let bIndex = 0;
      for (let i = 0; i < publicKey.byteLength; i++) {
        view.setInt8(bIndex++, publicKey[i]);
      }
      view.setUint32(bIndex++, index);

      data = new Uint8Array(ab);
    }

    const derivedData = CryptoUtils.digestSHA512(data, this.getChainCode());
    let derivedPrivateKey = derivedData.key;
    const derivedChainCode = derivedData.chainCode;

    let derivedPublicKey: Uint8Array = null;

    // Private parent key -> private child key
    if (privateKey) {
      // ki = parse256(IL) + kpar (mod n)
      try {
        assertBytes(privateKey, 32);
        assertBytes(derivedPrivateKey, 32);

        const privateKeyBn = this.bytesToNumber(privateKey);
        const childTweakBn = this.bytesToNumber(derivedPrivateKey);

        const added = this.modN(privateKeyBn + childTweakBn);
        if (!secp.utils.isValidPrivateKey(added)) {
          throw new Error('The private key is not valid, to derive next child');
        }
        derivedPrivateKey = this.numberToBytes(added);

        // throw if IL >= n || (privateKey + IL) === 0
      } catch (err) {
        // In case parse256(IL) >= n or ki == 0, one should proceed with the next value for i
        return this.deriveChild(index + 1)
      }
    // Public parent key -> public child key
    } else {
      // Ki = point(parse256(IL)) + Kpar
      //    = G*IL + Kpar
      try {
        derivedPublicKey = await this.getKeyFactory().publicKeyTweakAdd(publicKey, derivedPrivateKey, true);
        // throw if IL >= n || (g**IL + publicKey) is infinity
      } catch (err) {
        // In case parse256(IL) >= n or Ki is the point at infinity, one should proceed with the next value for i
        return this.deriveChild(index + 1)
      }
    }

    return this.createChildHDKey(index, derivedPrivateKey, derivedChainCode, derivedPublicKey);
  }

  private modN(a: bigint, b: bigint = secp.CURVE.n): bigint {
    const result = a % b;
    return result >= 0 ? result : b + result;
  }

  private bytesToNumber(bytes: Uint8Array): bigint {
    return BigInt(`0x${bytesToHex(bytes)}`);
  }

  private numberToBytes(num: bigint): Uint8Array {
    return hexToBytes(num.toString(16).padStart(64, '0'));
  }

}