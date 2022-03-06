import { TypeUtils, Hex } from "@/utils";
import { IAsymmetricKey } from "./interfaces";

import * as ed from "@noble/ed25519";

/**
 * Minimal wrapper to ed25519
 */
class KeyWrapper implements IAsymmetricKey {

  generatePrivateKey(): Promise<Uint8Array> {
    return Promise.resolve(ed.utils.randomPrivateKey());
  }

  createPublicKey(privateKey: Hex): Promise<Uint8Array> {
    return ed.getPublicKey(TypeUtils.parseHexToArray(privateKey));
  }

  async publicKeyTweakAdd(publicKey: Hex, tweak: Hex): Promise<Uint8Array> {
    const pb = ed.Point.fromHex(publicKey);
    const pk = await ed.Point.fromPrivateKey(tweak);
    return new Promise((resolve) => {
      resolve(pb.add(pk).toRawBytes());
    });
  }

}

export const Ed25519 = new KeyWrapper();
