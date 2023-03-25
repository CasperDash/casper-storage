import { secp256k1 as secp } from "@noble/curves/secp256k1";

import { base16 } from "@scure/base";
import KeyEncoder from "key-encoder";

import { TypeUtils, Hex } from "../../utils";
import { IAsymmetricKey } from "./interfaces";

const keyEncoder = new KeyEncoder("secp256k1");

/**
 * Minimal wrapper to secp256k1
 */
class KeyWrapper implements IAsymmetricKey {

  public generatePrivateKey(): Promise<Uint8Array> {
    return Promise.resolve(secp.utils.randomPrivateKey());
  }

  public createPublicKey(privateKey: Hex, compressed?: boolean): Promise<Uint8Array> {
    // Ensure we have valid byte-array
    privateKey = TypeUtils.parseHexToArray(privateKey);

    return Promise.resolve(secp.getPublicKey(privateKey, compressed));
  }

  public publicKeyTweakAdd(publicKey: Hex, tweak: Hex, compressed?: boolean): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      // Ensure we have valid byte-array
      publicKey = TypeUtils.parseHexToArray(publicKey);
      tweak = TypeUtils.parseHexToArray(tweak);

      const publicPoint = secp.ProjectivePoint.fromHex(publicKey);
      const tweakPoint = secp.ProjectivePoint.fromHex(tweak);

      return resolve(publicPoint.add(tweakPoint).toRawBytes(compressed));
    });
  }

  public isValidPrivateKey(privateKey: Hex): boolean {
    const privateKeyNumber = TypeUtils.bytesToNumber(TypeUtils.parseHexToArray(privateKey));
    if (privateKeyNumber == BigInt(0) || privateKeyNumber >= secp.CURVE.n) {
      return false;
    }
    return true;
  }

  public getKeyInPEM(key: Uint8Array, isPrivate: boolean): string {
    if (isPrivate) {
      return keyEncoder.encodePrivate(base16.encode(key), "raw", "pem");
    } else {
      return keyEncoder.encodePublic(base16.encode(key), "raw", "pem");
    }
  }

}

export const Secp256k1 = new KeyWrapper();
