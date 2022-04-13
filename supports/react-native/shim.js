/**
 * Guidelines
 * 
 * 1) Install required dependencies
 * big-integer, text-encoding, react-native-randombytes, buffer and casper-storage
 * 2) Import the whole shim.js in the main file
 */

// Polyfill BigInt, only available for browser/node for now (fix for android)
if (typeof BigInt === 'undefined') {
  const bigInt = require('big-integer');

  // The polyfill doesn't support hex yet, provide a temporary fix
  function myBigInt(value) {
    if (typeof value === 'string') {
      const match = value.match(/^0([xo])([0-9a-f]+)$/i);
      if (match) {
        return bigInt(match[2], match[1].toLowerCase() === 'x' ? 16 : 8);
      }
    }
    return bigInt(value);
  }

  global.BigInt = myBigInt;
}

// Hack for ** transformation (fix for ios)
// This hack should be removed after upgrading to metro which has version >0.66.2
{
  const nativePow = Math.pow;
  function powBigInt(x, power) {
    const _0n = BigInt(0);
    if (power == _0n) {
      return 1;
    }
    let res = x;
    if (power < _0n) {
      res /= x; // Get down to 1, e.g: 2 ** -1 => 1/2 = 0.5, 2 ** -2 = 1/2/2 = 0.25
      while (power++ < _0n) {
        res /= x;
      }
    } else {
      while (--power > _0n) {
        res *= x;
      }
    }
    return res;
  }
  function myPow(a, b) {
    if (typeof a === 'bigint') {
      return powBigInt(a, b);
    }
    return nativePow(a, b);
  }
  Math.pow = myPow;
}

// Polyfill text encoding utils
import { TextEncoder, TextDecoder } from 'text-encoding';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { CryptoUtils } from 'casper-storage';

// Override the randomBytes method, which is also only available for browser/node
import { randomBytes } from 'react-native-randombytes';
CryptoUtils.randomBytes = randomBytes;

// Buffer
// casper-js-sdk relies heavily on
global.Buffer = global.Buffer || require('buffer').Buffer;