const { TestEnvironment } = require('jest-environment-jsdom');
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('util');

module.exports = class CustomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    const global = this.global;

    if (typeof global.TextEncoder === 'undefined') {
      global.TextEncoder = TextEncoder;
      global.TextDecoder = TextDecoder;

      global.ArrayBuffer = ArrayBuffer;
      global.Uint8Array = Uint8Array;
    }

    Object.defineProperty(global, 'crypto', {
      value: {
        getRandomValues: arr => crypto.randomBytes(arr.length)
      }
    });

    Object.defineProperty(global.crypto, 'subtle', {
      value: crypto.subtle
    });
  }
};