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