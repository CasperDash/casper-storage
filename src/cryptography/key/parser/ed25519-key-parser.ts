import { BaseKeyParser } from "./base-key-parser";

/**
 * Specific implementation of Ed25519 to parse keys
 */
export class Ed25519KeyParser extends BaseKeyParser {

  protected parsePrivateKey(data: Uint8Array): Uint8Array {
    return this.parseKey(data, 0, 32);
  }

  private parseKey(data: Uint8Array, from: number, to: number) {
    if (data == null) {
      throw new Error("Key data is required");
    }

    let key: Uint8Array = null;

    const dataLength = data.length;
    if (dataLength === 32) {
      key = data;
    }
    else if (dataLength === 64) {
      key = new Uint8Array(data, from, to);
    }
    else if (dataLength > 32 && dataLength < 64) {
      key = data.slice(dataLength % 32);
    }

    if (key == null || key.length !== 32) {
      throw Error(`Unexpected key data`);
    }

    return key;
  }

}
