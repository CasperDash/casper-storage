import { base64, bytesToString, stringToBytes } from "@scure/base"
import { sha256 } from "@noble/hashes/sha256";
import { base58check } from "@scure/base";
import { TypeUtils } from "../../utils";

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
   * It encodes the data into a base64 string.
   * @param {string} data - The data to be encoded.
   * @returns The base64 encoded string.
   */
  public static encodeBase64(data: string): string {
    return base64.encode(stringToBytes("utf8", data || ""));
  }

  /**
   * It decodes the data from a base64 string.
   * @param {string} data - The base64 data to be decoded.
   * @returns The original string.
   */
  public static decodeBase64(data: string): string {
    return bytesToString("utf8", base64.decode(data));
  }

  /**
   * It encodes the data into a base58 string.
   * @param {Uint8Array} data - The data to be encoded.
   * @returns The base58 encoded string.
   */
 public static encodeBase58(data: Uint8Array): string {
    if (!data || !data.length) {
      throw new Error("Input data is required to encode base58");
    }
    return base58c.encode(data);
  }

  /**
   * Encode a text to byte-array
   * @param input 
   * @returns 
   */
  public static encodeText(input: string): Uint8Array {
    if (!TypeUtils.isString(input)) {
      throw new TypeError(`Expected string, got ${typeof input}`);
    }
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1681809
    return new Uint8Array(new TextEncoder().encode(input));
  }
  
  /**
   * Decode a byte-array to text
  */
  public static decodeText(input: BufferSource): string {
    return new TextDecoder().decode(input);
  }

}