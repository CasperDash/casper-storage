import { TypeUtils, Hex } from "../../utils";
import { IAsymmetricKey } from "./interfaces";

import * as ed from "@noble/ed25519";
import { base64 } from "@scure/base";

const ED25519_PEM_SECRET_KEY_TAG = 'PRIVATE KEY';
const ED25519_PEM_PUBLIC_KEY_TAG = 'PUBLIC KEY';

const PRIVATE_DER_PREFIX = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32]);
const PUBLIC_DER_PREFIX = new Uint8Array([48, 42, 48, 5, 6, 3, 43, 101, 112, 3, 33, 0]);

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

  public async publicKeyTweakAdd(): Promise<Uint8Array> {
    throw new Error("This method is not supported")
  }

  public getKeyInPEM(key: Uint8Array, isPrivate: boolean): string {
    if (isPrivate) {
      const encoded = base64.encode(TypeUtils.concatBytes(PRIVATE_DER_PREFIX, key));
      return this.toPem(ED25519_PEM_SECRET_KEY_TAG, encoded);
    } else {
      const encoded = base64.encode(TypeUtils.concatBytes(PUBLIC_DER_PREFIX, key));
      return this.toPem(ED25519_PEM_PUBLIC_KEY_TAG, encoded);
    }
  }

  /**
  * Inserts the provided `content` and `tag` into a .pem compliant string
  * @param tag The tag inserted on the END line
  * @param content The base-64 PEM compliant private key
  */
  private toPem(tag: string, content: string) {
    return `-----BEGIN ${tag}-----
${content}
-----END ${tag}-----`;
  }

}

export const Ed25519 = new KeyWrapper();
