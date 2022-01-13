# Casper storage

## Documents
- [Initial design](https://github.com/CasperDash/casper-storage/blob/master/document/01-casper-storage-design.md)
- [Technical document](https://casperdash.github.io/casper-storage/)

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

## Install
`npm install casper-storage`
`yarn add casper-storage`

## Usage

### Key generator
1. In order to use work with keys, import the *KeyFactory* from *casper-storage*
> `import { KeyFactory } from "casper-storage"`
2. To generate a new random key (default is mnemonic provider)
> `KeyFactory.getInstance().generate();`
> result /> indicate pony economy antique mountain nuclear jeans staff innocent follow butter increase
3. To convert the key to a seed, so we can use in as a master seed for HD wallet
> `KeyFactory.getInstance().toSeedArray("your keyphrase here");`
> result /> an instance of Uint8Array
4. To validate if a phrase is a valid key, following BIP39 standard
> `KeyFactory.getInstance().validate("your keyphrase here");`
> result /> either true or false