# Casper storage
> Following crypto standard libraries, BIPs, SLIPs, etc this library provides a generic solution which lets developers have a standard way to manage wallets

## Documents
- [Initial design](https://github.com/CasperDash/casper-storage/blob/master/document/01-casper-storage-design.md)
- [Technical document](https://casperdash.github.io/casper-storage/)

## Setup

### Browser
`<script src="https://cdn.jsdelivr.net/npm/casper-storage"></script>`

### Node
`npm install casper-storage` or `yarn add casper-storage`

### React-native
> Due to missing features of JavascriptCore, we need to polyfill and overrides some features (e.g BigInt, encoding, etc)

[Click here](https://github.com/CasperDash/casper-storage/blob/master/supports/react-native/README.md) for more detailed information

## Usage

### Key generator
1. In order to use work with keys, import the *KeyFactory* from *casper-storage*\
`import { KeyFactory } from "casper-storage"`
2. To generate a new random key (default is mnemonic provider)\
`KeyFactory.getInstance().generate();`\
*enlist announce climb census combine city endorse anxiety wedding combine sleep casino curtain only hedgehog venture inject funny banner cattle early erosion feed observe*
3. To convert the key to a seed, so we can use in as a master seed for HD wallet\
`KeyFactory.getInstance().toSeedArray("your keyphrase here");`\
*an instance of Uint8Array*
4. To validate if a phrase is a valid key, following BIP39 standard\
`KeyFactory.getInstance().validate("your keyphrase here");`\
*either true or false*

### Casper HD wallet (with keyphrase)
`import { KeyFactory, EncryptionType, CasperHDWallet } from "casper-storage"`
1. Create a new keyphrase (master key), default is 24-words-length phrase\
`const masterKey = KeyFactory.getInstance().generate()`

2. Convert the master key to the master seed\
`const masterSeed = KeyFactory.getInstance().toSeed(masterKey)`\
`const masterSeedArray = KeyFactory.getInstance().toSeedArray(masterKey)`

3. Create a new instance HDWallet from the master seed (either hex value or array buffer), with desired encryption mode\
`const hdWallet = new CasperHDWallet(masterSeed, EncryptionType.Ed25519);`

4. Get account wallet\
`const acc0 = await hdWallet.getAccount(0)`\
`const acc1 = await hdWallet.getAccount(1)`

5. Play with wallets\
`acc0.getPrivateKey()` returns the private key of wallet\
`await acc0.getAddress()` returns the public address of wallet\
`await acc0.sign(msgArray)` signs the message (Uint8Array) and returns the signed value (Uint8Array)

### Casper legacy wallet (with single private key)
`import { KeyFactory, EncryptionType, CasperLegacyWallet } from "casper-storage"`
1. Prepare the private key (input from user, or read from a file)
2. Create a new instance of CasperLegacyWallet with that private key (either hex string or Uint8Array data)\
`let wallet = new CasperLegacyWallet("a-private-key-hex-string", EncryptionType.Ed25519)`\
`let wallet = new CasperLegacyWallet(privateUint8ArrayData, EncryptionType.Secp256k1)`
3. This wallet will also share the same methods from a wallet of HDWallet\
e.g `await wallet.getAddress()`

## Progress
- [x] Key generator (mnemonic)
- [ ] Cryptography
  - [x] Asymmetric key implementation
    - [x] Ed25519
    - [x] Secp256k1
  - [ ] Utilities
    - [x] Common hash functions (HMAC, SHA256, SHA512, etc)
    - [ ] AES encryption
- [ ] Wallet
  - [x] Legacy wallet
  - [x] HD wallet
- [ ] User management
- [ ] Storage manament
