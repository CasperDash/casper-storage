
/**
 * Definition of hex data, either a hex string or an array of hex value
 */
export type Hex = string | Uint8Array;

/**
 * Provide utiltiies to work with types
 * - Convert hex value between types string and array of uint8
 * - Check types
 */
export class TypeUtils {

  /**
   * Convert the given array value to a hex string
   * @param input hex array
   * @returns 
   */
  static convertArrayToHexString(input: Uint8Array) {
    if (!input) return null;
    return [...input].map((x: number): string => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert an array of bytes to a string of binary digits
   * @param {Uint8Array} input - The input array of bytes.
   * @param [bitsPerValue=8] - The number of bits to use per value.
   * @returns The binary string representation of the input array.
   */
  static convertArrayToBinaryString(input: Uint8Array, bitsPerValue = 8) {
    if (!input) return null;
    return [...input].map((x: number): string => x.toString(2).padStart(bitsPerValue, '0')).join('');
  }

  /**
   * Convert the given hex string to an Uint8Array
   * @param input hex string
   * @returns 
   */
  static convertHexStringToArray(input: string): Uint8Array {
    if (!input) return new Uint8Array();
    return new Uint8Array(input.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }

  /**
   * It takes a hex value and converts it to a Uint8Array.
   * @param {Hex} input - The input to be converted to a Uint8Array.
   * @returns a `Uint8Array` object
   */
  static parseHexToArray(input: Hex): Uint8Array {
    if (TypeUtils.isString(input)) {
      return TypeUtils.convertHexStringToArray(input as string);
    }
    return input as Uint8Array;
  }

  /**
   * It takes a hex value and converts it to a hex string.
   * @param {Hex} input - The input to be converted to a string.
   * @returns The hex string representation of the input.
   */
  static parseHexToString(input: Hex): string {
    if (TypeUtils.isString(input)) {
      return input as string;
    }
    return TypeUtils.convertArrayToHexString(input as Uint8Array);
  }

  /**
   * It checks if the input is a string or a string instance.
   * @param {any} input - any
   * @returns `true` or `false`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isString(input: any): boolean {
    return typeof input === 'string' || input instanceof String; 
  }

}