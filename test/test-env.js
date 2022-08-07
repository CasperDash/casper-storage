const { TestEnvironment } = require('jest-environment-jsdom');
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('util');

module.exports = class CustomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {

      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;

      this.global.ArrayBuffer = ArrayBuffer;
      this.global.Uint8Array = Uint8Array;
    }

    Object.defineProperty(this.global, 'crypto', {
      value: {
        getRandomValues: arr => crypto.randomBytes(arr.length)
      }
    });

    Object.defineProperty(this.global.crypto, 'subtle', {
      value: {
        digest: (algorithm, data) => crypto.subtle.digest(algorithm, data)
      }
    });
  }
};