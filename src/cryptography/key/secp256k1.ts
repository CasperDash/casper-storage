import * as secp from "@noble/secp256k1";

import { TypeUtils, Hex } from "../../utils";
import { IAsymmetricKey } from "./interfaces";

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

      const publicPoint = secp.Point.fromHex(publicKey);
      const tweakPoint = secp.Point.fromHex(tweak);

      return resolve(publicPoint.add(tweakPoint).toRawBytes(compressed));
    });
  }

}

export const Secp256k1 = new KeyWrapper();
