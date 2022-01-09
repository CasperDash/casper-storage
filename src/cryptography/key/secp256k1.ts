import * as secp from "@noble/secp256k1";

import { TypeUtils, Hex } from "@/utils";
import { IAsymmetricKey } from "./interfaces";

/**
 * Minimal wrapper to secp256k1
 */
class KeyWrapper implements IAsymmetricKey {

  generatePrivateKey(): Promise<Uint8Array> {
    return Promise.resolve(secp.utils.randomPrivateKey());
  }

  createPublicKey(privateKey: Hex, isCompessed?: boolean): Promise<Uint8Array> {
    return Promise.resolve(secp.getPublicKey(TypeUtils.parseHexToArray(privateKey), isCompessed));
  }

  sign(privateKey: Hex, msg: Uint8Array): Promise<Uint8Array> {
    return Promise.resolve(secp.signSync(TypeUtils.parseHexToArray(msg), privateKey));
  }

  publicKeyTweakAdd(publicKey: Hex, tweak: Hex, compressed?: boolean): Promise<Uint8Array> {
    return Promise.resolve(secp.Point.fromHex(publicKey).add(secp.Point.fromPrivateKey(tweak)).toRawBytes(compressed));
  }

}

export const Secp256k1 = new KeyWrapper();
