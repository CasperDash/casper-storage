# Caspter storage

> Following crypto standard libraries, BIPs, SLIPs. etc this library provides a generic solution which lets developers have a standard way to manage wallets, store and retrieve users' information.

## Scenarios

### New users

A user (Alice) accesses a wallet management (`CasperWallet`) for the very first time

`CasperWallet` asks Alice for a `password`
`CasperWallet` generates a master key (mnemonic)
`CasperWallet` asks Alice to backup this key
> e.g by writing down on paper and keeping it in a secret box

`CasperWallet` then asks Alice to choose an `encryption mode` (either secp256k1 or ed25519) 
> `CasperWallet` should recommend Alice to choose `ed25519` over secp256k1 due to security and performance, unless Alice explicitly wants to use secp256k1 because of Bitcoin, Ethereum compatible 

`CasperWallet` creates a local account with Alice's password, initializes the HD wallet in this account
`CasperWallet` encrypts the account and save all information into local storage (in order to restore the wallet when Alice comes back next time)
`CasperWallet` navigates Alice to his wallet screen and shows the first account (0-indexed)
>`CasperWallet` might also automatically scan for the next accounts that have made at least one transaction and list them out in the account list

### Users have existing wallets

> A wallet is an address which is presented by a private key

Following the same above steps, Alice should have a local account with the HD wallet already.
However he might also have several legacy wallets which he has accordingly private keys
`CasperWallet` supports him to import these wallets into his account and let him manage them
> by giving private keys or import from back-up files

`CasperWallet` also encrypts the account again (now it has the HD wallet key, and legacy wallets) to save in local storage.
When Alice comes back next time with his right password, he will able to access this account with HD wallet and his legacy wallets again.

## Overview

This library contains 5 main packages

- master-key: utilities to generate secret keys (phrases) which can then be used as seeds to create wallets
- user: manage user's information, HDWalletwallet and legacy wallets, enriched wallet information (name, icon, etc)
- wallet: import and export HD wallet (or legacy wallets) from keys
- cryptography: utilities to encrypt, decrypt data and security related tools
- storage: provide the ability to store key-value pairs, depending on environments (web or mobile)

## Architecture overview

![](https://i.imgur.com/fi5Miz4.jpg)


## Packages

### master-key

Regardless that we emphasize to use mnemonic phrases as secret keys, this package provides a generic solution to easily swich between key providers if needed.

`import { MasterKeyProvider } from "casper-storage/master-key"`

`MasterKeyProvider.getInstance()` returns an instance of `IMasterKeyProvider`
>`MenomonicKeyProvider` by default

`IMasterKeyProvide` provides methods:
- `generate()` generates a secret key for each call
- `convertToEntropy(key)` converts the key to an entropy value
- `convertToKey(entropy)` converts the entropy to a human-readable key (phrase)
- `convertToSeed(key | entropy)` converts a key to a seed as an input of the HD wallet

Refs:
- https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- https://www.npmjs.com/package/bip39

### cryptography

`import { Crypto, CrytoUtils } from "casper-storage/cryptography"`

The `Crypto` should be initialized with a password as `let c = new Cryto(password)`
and then we can use it to encrypt and decrypt values

- `c.encrypt(value)`
- `c.decrypt(value)`

The encrypted value (by the AES method, an industry standard for encryption) should only be able to be decypted when users provide the same password

Utilities
- CryptoUtils.createHmac(key: string | Uint8Array)
- CryptoUtils.digestData(key: string | Uint8Array, data: string | Uint8Array)
- CryptoUtils.hash160(data: Uint8Array)

Refs:
https://www.npmjs.com/package/crypto-js


### wallet

Supports key types (but not limited to) which are supported by Casper (secp256k1 and ed25519)

`import { WalletManager, IWallet, IHDWallet, ILegacyWallet } from "caspter-storage/wallet"`

The `WalletManager` provides 2 main actions:
- `createLegacyWallet(privateKey, keyType): ILegacyWallet`
- `createHDWalet(masterKey, keyType): IHDWallet`
- `keyType` which is either secp256k1 or ed25519
- `ILegacyWallet` presents for a legacy wallet, which works with a specific private key
- `IHDWallet` presents a hierarchical deterministic wallet (BIP32)

Both kinds of wallet inherits from `IWallet`
- `IWallet.getID(): string` returns a computed id from the wallet key

Refs:
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
- https://github.com/alepop/ed25519-hd-key
- https://fission.codes/blog/everything-you-wanted-to-know-about-elliptic-curve-cryptography/

### user

Provides a high level class, let us easily work with 

`import { User } from "caspter-storage/user"`

Create a new account with user's password
- `let user = User(password)`

Propreties
- `wallets: IWallet[]` presents legacy wallets
- `hdWallet: IHDWallet` presents a HD wallet
- `walletsInfo: Map<string, IWalletInfo>` presents wallet information

Methods to serialize, deserialize account to integrate with storage
- `user.serialize(): string`
- `user.deserialize(data: string)`

Methods to work with HDWallet
- `user.getHDWallet(): IHDWallet`
- `user.setHDWallet(wallet: IHDWallet)`
- `user.addHDWalletAccount(index: number, info?: string | WalletInfo)`
- `user.removeHDWalletAccount(index: number)`

Methods to work with legacy wallets
- `user.addLegacyWallet(wallet: IWallet, info?: string | WalletInfo)`
- `user.getLegacyWallets(): IWallet[]`
- `user.hasLegacyWallets(): bool`

Methods to work with wallet information
- `user.setWalletInfo(id: string, name: string)`
- `user.getWalletInfo(id: string): WalletInfo`

An instance of User to be encrypted and keep in storage should have following format:
```json
{
    "wallet": {
        "key": "the hex seed of master key",
        "derives": [
            {
                "key": "m/44'/X'/0'/0/0",
                "name": "Account 1"
            },
            {
                "key": "m/44'/X'/1'/0/0",
                "name": "Account 2"
            }
        ]
    },
    "wallets": [
        {
            "key": "privateKey01",
            "name": "Legacy wallet 1"
        },
        {
            "key": "privateKey02",
            "name": "Legacy wallet 2"
        }
    ]
}
```

### storage

`import { Storage } from "casper-storage/storage"`

The `Storage.getInstance()` provides an instance of `IStorage`, depending on the current environment, which exposes available methods to help us store and retrieve pairs of key-value

`IStorage` provides basic actions
- `set(key, value)` stores the value by key in storage
- `get(key)` get the stored value by key in storage, null if it is not available
- `remove(key)` removes the stored value by key
- `clear()` removes all keys which are managed by this storage

e.g:
on web applications - the `IStorage` would be implemented by `WebStorage` which is a wrapper of `localStorage`
on mobile application, TBD


# Javascript
## Mnemonic - BIP39
- https://github.com/bitcoinjs/bip39
## HDWallet
- https://github.com/cryptocoinjs/hdkey
- https://github.com/alepop/ed25519-hd-key

# Java
## Mnemonic - BIP39
BitcoinJ
- https://github.com/bitcoinj/bitcoinj/blob/master/core/src/main/java/org/bitcoinj/crypto/MnemonicCode.java

NovaCrypto
- https://github.com/NovaCrypto
Others
- https://stackoverflow.com/questions/55622851/seed-from-bip39-mnemonic-not-matching-test-vectors
- https://yenhuang.gitbooks.io/blockchain/content/hd-wallet.html
- https://github.com/btchip/wallet/blob/master/public/bitlib/src/main/java/com/mrd/bitlib/crypto/Bip39.java

## HDWallet 
- https://github.com/orogvany/BIP32-Ed25519-java
- https://github.com/NovaCrypto/BIP32

# Swift
- https://github.com/skywinder/web3swift (secp)
- https://github.com/binance-chain/wallet-core-carthage/tree/master/wallet-core/swift/Sources/Generated/Enums

# C#
For references
- https://github.com/farukterzioglu/HDWallet

# Our very first proposal implementation for js
| Once done for js, we can easily port code to any platform (java, swift, etc)

https://github.com/codsay/blockchainjs/
Cover all test vectors which are provided by BIP32 and SLIP10
