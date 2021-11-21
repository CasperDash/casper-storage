# Caspter storage

> Following crypto standard libraries, BIPs, etc., this library provides a generic solution which lets developers have a standard way to manage wallets, store and retrieve users' information.

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
- account: manage user information, HDWalletwallet  and legacy wallets, enriched wallet information (name, icon, etc)
- wallet: import and export HD wallet (or legacy wallets) from keys
- cryptography: utilities to encrypt and decrypt data, or security related tools
- storage: provide the ability to store key-value pairs, depending on environments (web / mobile)

## Architecture overview

![](https://i.imgur.com/y1SNGPK.jpg)


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
https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
https://www.npmjs.com/package/bip39

### cryptography

`import { Crypto, CrytoUtils } from "casper-storage/cryptography"`

The `Crypto` should be initialized with a password as `let c = new Cryto(password)`
and then we can use it to encrypt and decrypt values

`c.encrypt(value)`
`c.decrypt(value)`

The encrypted value (by the AES method, an industry standard for encryption) should only be able to be decypted when users provide the same password

Utilities
- Compute a checksum value
`CrytoUtils.computeChecksum(data): string`

Refs:
https://www.npmjs.com/package/crypto-js


### wallet

Supports key types (but not limited to) which are supported by Casper (secp256k1 and ed25519)

`import { WalletManager, IWallet, IHDWallet, ILegacyWallet } from "caspter-storage/wallet"`

The `WalletManager` provides 2 main actions:
`createLegacyWallet(privateKey, keyType): ILegacyWallet`
`createHDWalet(masterKey, keyType): IHDWallet`

`keyType` which is either secp256k1 or ed25519

`ILegacyWallet` presents for a legacy wallet, which works with a specific private key
`IHDWallet` presents a hierarchical deterministic wallet (BIP32)

Both kinds of wallet inherits from `IWallet`
`IWallet.getID(): string` returns a computed id from the wallet key

Refs:
https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
https://github.com/alepop/ed25519-hd-key
https://fission.codes/blog/everything-you-wanted-to-know-about-elliptic-curve-cryptography/

### account

Provides a high level class, let us easily work with wallets

`import { Account } from "caspter-storage/account"`

Create a new account with user's password
`let acc = Account(password)`

Propreties
`wallets: IWallet[]` presents legacy wallets
`hdWallet: IHDWallet` presents HD wallet
`walletsInfo: Map<string, IWalletInfo>` presents wallet information

Methods to serialize, deserialize account to integrate with storage
`acc.serialize(): string`
`acc.deserialize(data: string)`

Methods to work with HDWallet
`acc.getHDWallet(): IHDWallet`
`acc.setHDWallet(wallet: IHDWallet)`
`acc.addHDWalletDerive(index: number, info?: string | WalletInfo)`
`acc.removeHDWalletDerive(index: number)`

Methods to work with legacy wallets
`acc.addLegacyWallet(wallet: IWallet, info?: string | WalletInfo)`
`acc.getLegacyWallets(): IWallet[]`
`acc.hasLegacyWallets(): bool`

Methods to work with wallet information
`acc.setWalletInfo(id: string, name: string)`
`acc.getWalletInfo(id: string): WalletInfo`

an account to be encrypted and keep in storage should have following format:
```json
{
    hdWallet: IHDWallet,
    wallets: [ IWallet, IWallet],
    walletsInfo: {
       "0c2fe3fe": {
           Name: "My simple account 1"
       },
       "0ace82fa": {
           Name: "My simple account 2"
       },
       "02fea22c_0": {
           Name: "My account 1"
       },
       "02fea22c_1": {
           Name: "My account 2"
       }
   }
}
```
> 0c2fe3fe, 0ace82fa, 02fea22c are id of wallets

### storage

`import { Storage } from "casper-storage/storage"`

The `Storage.getInstance()` provides an instance of `IStorage`, depending on the current environment, which exposes available methods to help us store and retrieve pairs of key-value

`IStorage` provides basic actions
- `set(key, value)` stores the value by key in storage
- `get(key)` get the stored value by key in storage, null if it is not available
- `remove(key)` removes the stored value by key
- `clear()` removes all keys which are managed by this storage

>each method should also have a variant of Async mode

e.g:
on web applications - the `IStorage` would be implemented by `WebStorage` which is a wrapper of `localStorage`
on mobile application, TBD