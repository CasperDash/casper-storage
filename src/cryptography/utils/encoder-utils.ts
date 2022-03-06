import { base64 } from "@scure/base"
import { sha256 } from "@noble/hashes/sha256";
import { utf8ToBytes } from "@noble/hashes/utils";
import { base58check } from "micro-base";

const base58c = base58check(sha256);

/**
 * Provide utiltiies to encode/decode values
 */
export class EncoderUtils {

  /**
   * Read the PEM content and decode it as base64 data
   * @param content 
   * @returns 
   */
  public static readBase64PEM(content: string): Uint8Array {
    if (!content) {
      throw new Error("PEM content is required");
    }

    const base64Content = content
      // There are two kinds of line-endings, CRLF(\r\n) and LF(\n)
      .split(/\r?\n/)
      // Takes actual content
      .filter(x => !x.startsWith('---'))
      .join('')
      // Remove the line-endings in the end of content
      .trim();

    return base64.decode(base64Content);
  }

  /**
   * It encodes the data into a base58 string.
   * @param {Uint8Array} data - The data to be encoded.
   * @returns The base58 encoded string.
   */
  static encodeBase58(data: Uint8Array): string {
    if (!data || !data.length) {
      throw new Error("Input data is required to encode base58");
    }

    return base58c.encode(data);
  }

  /**
   * Encode an UTF8 text to byte-array
   * @param input 
   * @returns 
   */
  public static encodeText(input: string): Uint8Array {
    if (!input) {
      throw new Error("Input text is required to encode");
    }

    return utf8ToBytes(input);
  }

}