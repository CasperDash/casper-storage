import * as bip39 from "@/bips/bip39";
import { TypeUtils } from "@/utils";

var vectors = require('./vectors.json')

function testVector(description, wordlist, password, v, i) {
  var ventropy = v[0]
  var vmnemonic = v[1]
  var vseedHex = v[2]

  test('for ' + description + '(' + i + '), ' + ventropy, () => {
    expect(bip39.mnemonicToEntropy(vmnemonic, wordlist)).toBe(ventropy);
    expect(TypeUtils.convertArrayToHexString(bip39.mnemonicToSeedSync(vmnemonic, password))).toBe(vseedHex);
    bip39.mnemonicToSeed(vmnemonic, password).then(function (asyncSeed) {
      expect(TypeUtils.convertArrayToHexString(asyncSeed)).toBe(vseedHex);
    })
    expect(bip39.entropyToMnemonic(ventropy, wordlist)).toBe(vmnemonic);

    function rng () { return TypeUtils.convertHexStringToArray(ventropy) }
    expect(bip39.generateMnemonic(undefined, rng, wordlist)).toBe(vmnemonic);
    expect(bip39.validateMnemonic(vmnemonic, wordlist)).toBe(true);
  })
}

vectors.english.forEach(function (v, i) { testVector('English', undefined, 'TREZOR', v, i) })

test('invalid entropy', () => {
  expect(function () {
    bip39.entropyToMnemonic(Buffer.from('', 'hex'))
  }).toThrow("Invalid entropy");

  expect(function () {
    bip39.entropyToMnemonic(Buffer.from('000000', 'hex'))
  }).toThrow("Invalid entropy");

  expect(function () {
    bip39.entropyToMnemonic(Buffer.from(new Array(1028 + 1).join('00'), 'hex'))
  }).toThrow("Invalid entropy");
})

test('UTF8 passwords', () => {
  vectors.japanese.forEach(function (v) {
    var vmnemonic = v[1]
    var vseedHex = v[2]

    var password = '㍍ガバヴァぱばぐゞちぢ十人十色'
    var normalizedPassword = 'メートルガバヴァぱばぐゞちぢ十人十色'

    expect(TypeUtils.convertArrayToHexString(bip39.mnemonicToSeedSync(vmnemonic, password))).toBe(vseedHex);
    expect(TypeUtils.convertArrayToHexString(bip39.mnemonicToSeedSync(vmnemonic, normalizedPassword))).toBe(vseedHex);
  })
})

test('generateMnemonic can vary entropy length', () => {
  var words = bip39.generateMnemonic(160).split(' ')
  expect(words.length).toBe(15);
})

test('generateMnemonic requests the exact amount of data from an RNG', () => {
  bip39.generateMnemonic(160, function (size) {
    expect(size).toBe(160 / 8);
    return Buffer.allocUnsafe(size)
  })
})

test('validateMnemonic', () => {
  expect(bip39.validateMnemonic('sleep kitten')).toBe(false);
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten')).toBe(false);
  expect(bip39.validateMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about end grace oxygen maze bright face loan ticket trial leg cruel lizard bread worry reject journey perfect chef section caught neither install industry')).toBe(false);
  expect(bip39.validateMnemonic('turtle front uncle idea crush write shrug there lottery flower risky shell')).toBe(false);
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten')).toBe(false);
})

test('exposes standard wordlists', () => {
  expect(bip39.getWorkdList().length).toBe(2048);
})
