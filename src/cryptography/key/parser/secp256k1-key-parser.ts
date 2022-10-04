import { BaseKeyParser } from "./base-key-parser";
import { EncryptionType } from "../../../cryptography";

import * as asn1Js from "asn1.js";

const ECPrivateKeyASN = asn1Js.define("ECPrivateKey", function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
  const self: any = this;
  self.seq().obj(
      self.key("version").int(),
      self.key("privateKey").octstr(),
      self.key("parameters").explicit(0).objid().optional(),
      self.key("publicKey").explicit(1).bitstr().optional()
  )
})

/**
 * Specific implementation of Secp256k1 to parse keys
 */
export class Secp256k1KeyParser extends BaseKeyParser {

  public constructor() {
    super(EncryptionType.Secp256k1);
  }

  protected parsePrivateKey(data: Uint8Array): Uint8Array {
    return this.parseKey(data);
  }

  private parseKey(data: Uint8Array): Uint8Array {
    // Convert digital certificate format to raw format
    const privateKeyObject = ECPrivateKeyASN.decode(Buffer.from(data), "der");
    return new Uint8Array(privateKeyObject.privateKey);
  }
}

