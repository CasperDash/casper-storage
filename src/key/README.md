# Master key provider

## Mnemophic
| Ref to [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)

## Usage
Import the provider
> `import { KeyProvider } from "blockchainjs/master-key"`

Get an instance of provider
> `let keyMgr = KeyProvider.getInstance();`

Generate a random phrase of 12 (by default) words
> `keyMgr.generate()`

> e.g: crystal cinnamon alert dizzy thing grant animal hip salmon idle uphold science

Convert the given phrase to a seed as a hex string
> `keyMgr.toSeed(12_words)`

Convert the given phrase to an Uint8Array
> `keyMgr.toSeedArray(12_words)`
