import { HDKey } from "./hd-key";
import { CryptoUtils } from "../../../cryptography";
import { assertBytes } from '@noble/hashes/utils';

import * as secp from '@noble/secp256k1';
import { TypeUtils } from "../../../utils";

export class HDKeySecp256k1 extends HDKey {

  protected createNewHDKey(privateKey: Uint8Array, chainCode: Uint8Array, publicKey: Uint8Array) {
    return new HDKeySecp256k1(this.config, privateKey, chainCode, publicKey);
  }

  protected async deriveChild(index: number): Promise<HDKey> {
    const privateKey = this.getPrivateKey();
    const publicKey = await this.getPublicKey();

    if (!publicKey || !this.chainCode) {
      throw new Error('No publicKey or chainCode set');
    }

    const isHardened = index >= this.getHardenedOffset();
    let data = TypeUtils.convertU32ToBytes(index);
    if (isHardened) {
      if (!privateKey) {
        throw new Error("Cannot derive a hardened child without private key")
      }
      // Hardened child: data = 0x00 || ser256(kpar) || ser32(index)
      data = TypeUtils.concatBytes(TypeUtils.getBytesOfZero(), privateKey, data);
    } else {
      // Normal child: serP(point(kpar)) || ser32(index)
      data = TypeUtils.concatBytes(publicKey, data);
    }

    const derivedData = CryptoUtils.digestSHA512(data, this.getChainCode());
    let derivedPrivateKey = derivedData.key;
    const derivedChainCode = derivedData.chainCode;

    if (!secp.utils.isValidPrivateKey(derivedPrivateKey)) {
      throw new Error('Tweak bigger than curve order');
    }

    let derivedPublicKey: Uint8Array = null;

    try {
      if (privateKey) {
        // Private parent key -> private child key
        assertBytes(privateKey, 32);
        assertBytes(derivedPrivateKey, 32);

        const privateKeyBn = TypeUtils.bytesToNumber(privateKey);
        const childTweakBn = TypeUtils.bytesToNumber(derivedPrivateKey);

        const added = secp.utils.mod(privateKeyBn + childTweakBn, secp.CURVE.n);
        if (!secp.utils.isValidPrivateKey(added)) {
          throw new Error('The tweak was out of range or the resulted private key is invalid');
        }
        derivedPrivateKey = TypeUtils.numberToBytes(added);
      } else {
        // Public parent key -> public child key
        derivedPublicKey = await this.getKeyFactory().publicKeyTweakAdd(publicKey, derivedPrivateKey, true);
      }
    } catch (err) {
      return this.deriveChild(index + 1);
    }

    return this.createChildHDKey(index, derivedPrivateKey, derivedChainCode, derivedPublicKey);
  }

}