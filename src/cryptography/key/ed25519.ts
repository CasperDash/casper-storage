import { TypeUtils, Hex } from "../../utils";
import { IAsymmetricKey } from "./interfaces";

import * as ed from "@noble/ed25519";

/**
 * Minimal wrapper to ed25519
 */
class KeyWrapper implements IAsymmetricKey {

  public generatePrivateKey(): Promise<Uint8Array> {
    return Promise.resolve(ed.utils.randomPrivateKey());
  }

  public createPublicKey(privateKey: Hex): Promise<Uint8Array> {
    // Ensure we have valid byte-array
    privateKey = TypeUtils.parseHexToArray(privateKey);

    return ed.getPublicKey(TypeUtils.parseHexToArray(privateKey));
  }

  async publicKeyTweakAdd(): Promise<Uint8Array> {
    throw new Error("This method is not supported")
  }

}

export const Ed25519 = new KeyWrapper();
