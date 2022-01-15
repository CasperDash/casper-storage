// Polyfill BigInt, only available for browser/node for now
if (typeof BigInt === 'undefined') {
  const bigInt = require('big-integer')

  // The polyfill doesn't support hex yet, provide a temporary fix
  function myBigInt(value) {
    if (typeof value === 'string') {
      const match = value.match(/^0([xo])([0-9a-f]+)$/i)
      if (match) {
        return bigInt(match[2], match[1].toLowerCase() === 'x' ? 16 : 8)
      }
    }
    return bigInt(value)
  }

  global.BigInt = myBigInt;
} 

// Polyfill text encoding utils
import { TextEncoder, TextDecoder } from 'text-encoding';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { CryptoUtils } from "casper-storage";

// Override the randomBytes method, which is also only available for browser/node
import { randomBytes } from "react-native-randombytes";
CryptoUtils.randomBytes = randomBytes;