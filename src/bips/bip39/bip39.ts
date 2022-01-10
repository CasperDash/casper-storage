/**
 * Copy and modify source from bip39 JS (https://github.com/bitcoinjs/bip39)
 * - Replace Buffer by typed array
 * - Use built-in crypto instead of create-hash module
 * - Replace pdfkdf2 module by using functions from crypto module
 * - Replace randombytes module using functions from crypto module
 */

import { CryptoUtils } from '@/cryptography';
import { TypeUtils } from '@/utils';
import { _default as _DEFAULT_WORDLIST } from './_wordlists';

const DEFAULT_WORDLIST: string[] | undefined = _DEFAULT_WORDLIST;

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY  = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
  'A wordlist is required but a default could not be found.\n' +
  'Please pass a 2048 word array explicitly.';

function normalize(str?: string): string {
  return (str || '').normalize('NFKD');
}

function binaryToByte(bin: string): number {
  return parseInt(bin, 2);
}

function deriveChecksumBits(entropy: Uint8Array): string {
  const ENT = entropy.length * 8;
  const CS = ENT / 32;
  const hash = CryptoUtils.hash256(entropy);
  return TypeUtils.convertArrayToBinaryString(hash).slice(0, CS);
}

function salt(password?: string): string {
  return 'mnemonic' + (password || '');
}

export function mnemonicToSeedSync(
  mnemonic: string,
  password?: string,
): Uint8Array {
  const mnemonicArr = CryptoUtils.convertUt8ToByteArray(normalize(mnemonic));
  const saltArr = CryptoUtils.convertUt8ToByteArray(salt(normalize(password)));
  return CryptoUtils.pbkdf2Sync(mnemonicArr, saltArr, 2048, 64, 'sha512');
}

export function mnemonicToSeed(
  mnemonic: string,
  password?: string,
): Promise<Uint8Array> {
  return Promise.resolve().then(
    (): Promise<Uint8Array> => {
      const mnemonicArr = CryptoUtils.convertUt8ToByteArray(normalize(mnemonic));
      const saltArr = CryptoUtils.convertUt8ToByteArray(salt(normalize(password)));
      return CryptoUtils.pbkdf2(mnemonicArr, saltArr, 2048, 64, 'sha512');
    },
  );
}

export function mnemonicToEntropy(
  mnemonic: string,
  wordlist?: string[],
): string {
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  const words = normalize(mnemonic).split(' ');
  if (words.length % 3 !== 0) {
    throw new Error(INVALID_MNEMONIC);
  }

  // convert word indices to 11 bit binary strings
  const bits = words
    .map(
      (word: string): string => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
          throw new Error(INVALID_MNEMONIC);
        }
        return index.toString(2).padStart(11, '0');
      },
    )
    .join('');

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
  if (entropyBytes.length < 16) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length > 32) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length % 4 !== 0) {
    throw new Error(INVALID_ENTROPY);
  }

  const entropy = Uint8Array.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(INVALID_CHECKSUM);
  }

  return TypeUtils.convertArrayToHexString(entropy);
}

export function entropyToMnemonic(
  entropy: Uint8Array | string,
  wordlist?: string[],
): string {
  let entropyArr: Uint8Array;
  if (TypeUtils.isString(entropy)) {
    entropyArr = TypeUtils.convertHexStringToArray(entropy as string);
  }
  else {
    entropyArr = entropy as Uint8Array;
  }

  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
    throw new Error(WORDLIST_REQUIRED);
  }

  // 128 <= ENT <= 256
  if (entropyArr.length < 16) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropyArr.length > 32) {
    throw new TypeError(INVALID_ENTROPY);
  }
  if (entropyArr.length % 4 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }

  const entropyBits = TypeUtils.convertArrayToBinaryString(entropyArr);
  const checksumBits = deriveChecksumBits(entropyArr);

  const bits = entropyBits + checksumBits;
  const chunks = bits.match(/(.{1,11})/g);
  const words = chunks.map(
    (binary: string): string => {
      const index = binaryToByte(binary);
      return wordlist[index];
    },
  );

  return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
    ? words.join('\u3000')
    : words.join(' ');
}

export function generateMnemonic(
  strength?: number,
  rng?: (size: number) => Uint8Array,
  wordlist?: string[],
): string {
  strength = strength || 128;
  if (strength % 32 !== 0) {
    throw new TypeError(INVALID_ENTROPY);
  }
  rng = rng || CryptoUtils.randomBytes;

  return entropyToMnemonic(rng(strength / 8), wordlist);
}

export function validateMnemonic(
  mnemonic: string,
  wordlist?: string[],
): boolean {
  try {
    mnemonicToEntropy(mnemonic, wordlist);
  } catch (e) {
    return false;
  }

  return true;
}
