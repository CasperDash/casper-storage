# Casper storage

> Following crypto standard libraries, BIPs, SLIPs. etc this library provides a generic solution which lets developers have a standard way to manage wallets, store and retrieve users' information.

## Scenarios

### New users

A user (Alice) accesses a wallet management (`CasperWallet`) for the very first time

- `CasperWallet` asks Alice for a **secure** `password`
- `CasperWallet` generates a master key (mnemonic)
- `CasperWallet` asks her to backup this key
- `CasperWallet` asks her to confirm the mnemonic phrase
> e.g by writing down on paper and keeping it in a secret box

- `CasperWallet` then asks her to choose an `encryption mode` (either secp256k1 or ed25519) 
> `CasperWallet` should recommend her to choose `ed25519` over secp256k1 due to security and performance, unless Alice explicitly wants to use secp256k1 because of Bitcoin, Ethereum compatible 

- `CasperWallet` creates a local account with Alice's password, initializes the HD wallet in this account
- `CasperWallet` **encrypts** the account and save all information into *local storage* or a *secure storage* (in order to restore the wallet when she comes back next time)
- `CasperWallet` navigates Alice to her wallet screen and shows the first account (0-indexed)
>`CasperWallet` might also automatically scan for the next accounts that have made at least one transaction and list them out in the account list (limit up to 20 accounts without funds in a row according to the bip44 spec)

### Users have existing wallets

> A wallet is an address which is presented by a private key

Following the same above steps, Alice should have a local account with the HD wallet already.<br/>
However she might also have several legacy wallets which she also has accordingly private keys<br/>
`CasperWallet` supports her to import these wallets into her account and let her manage them
> by giving private keys or importing from back-up files

`CasperWallet` also encrypts the account again (now it has the HD wallet key, and legacy wallets) to save in local storage.<br/>
When Alice comes back next time with her right password, she will able to access this account with her HD wallet and her legacy wallets again.

## Overview

This library contains 5 main modules

- key: utilities to generate secret keys (phrases) which can then be used as seeds to create wallets
- user: manage user's information, HD wallet and legacy wallets, enriched wallet information (name, icon, etc)
- wallet: import and export HD wallet (or legacy wallets) from/to keys
- cryptography: utilities to encrypt, decrypt data and security related tools
- storage: provide the ability to store key-value pairs, depending on environments (web or mobile)

## Architecture overview

![](https://i.imgur.com/5Y0yB1p.png)

## Modules

### 1. key

Regardless that we emphasize to use mnemonic phrases as secret keys, this module provides a generic solution to easily swich between key providers if needed.

`import { KeyFactory } from "casper-storage/key"`

`KeyFactory.getInstance()` returns an instance of `IKeyManager`
>`MnemonicKey` by default

`IKeyManager` provides methods:
- `generate()` generates a secret key for each call
- `validate(key: string)` validate if the given key is a valid standard mnemonic key
- `convertToEntropy(key: string)` converts the key to an entropy value
- `convertToKey(entropy)` converts the entropy to a human-readable key (phrase)
- `convertToSeed(key | entropy)` converts a key to a seed as an input of the HD wallet

Refs:
- https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- https://www.npmjs.com/package/bip39

### 2. cryptography

`import { EncryptionType, CrytoUtils } from "casper-storage/cryptography"`

The `EncryptionType` defines 2 modes: Ed25519 and Secp256k1

The `CryptoUtils` provide convenience encryption methods like `hash160`, `hash256`, `pbkdf2`, `encryptAES`, `decryptAES`

### 3. wallet

Supports key types (but not limited to) which are supported by Casper (secp256k1 and ed25519)

`import { IWallet, IHDWallet, ILegacyWallet } from "casper-storage/wallet"`

The `WalletManager` provides main actions:
- `createHDWalet(masterKey, keyType): IHDWallet`
- `createLegacyWallet(privateKey, keyType): ILegacyWallet`
- `importLegacyWalletFromFile(file, keyType): ILegacyWallet`

Where:
- `keyType` which is either secp256k1 or ed25519
- `IHDWallet` presents a hierarchical deterministic wallet (BIP32 / SLIP10)
- `ILegacyWallet` presents for a legacy wallet, which works with a specific private key
- `IWallet` presents a basic wallet which provides common methods for both legacy and HD wallet
  - `getPrivateKey()`
  - `getPublicKey()`
  - `getPublicAddress()`
  - `getPublicHash()`
  - `sign(message)`

Refs:
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
- https://github.com/alepop/ed25519-hd-key
- https://fission.codes/blog/everything-you-wanted-to-know-about-elliptic-curve-cryptography/
- https://github.com/satoshilabs/slips/blob/master/slip-0010.md

### 4. user

Provides a high level class, let us centeralize businesses to manage user's wallets

`import { User } from "casper-storage/user"`

Create a new account with user's password
- `let user = User(password)`

Propreties
- `wallet: HDWalletInfo` presents a HD wallet and its information
  - `HDWalletInfo: { key: string, derives: WalletInfo[] }`
- `legacyWallets: WalletInfo[]` presents legacy wallets and their information
   - `WalletInfo: { key: string, name: string }`

Methods to serialize, deserialize an account to integrate with storage
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
- `user.setWalletInfo(id: string, name: string, legacyWallet: bool = false)`
- `user.getWalletInfo(id: string, legacyWallet: bool = false): WalletInfo`

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
    "legacyWallets": [
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

### 5. storage

`import { Storage } from "casper-storage/storage"`

The `Storage.getInstance()` provides an instance of `IStorage`, depending on the current environment, which exposes available methods to help us store and retrieve pairs of key-value

`IStorage` provides basic actions
- `set(key, value)` stores the value by key in storage
- `get(key)` get the stored value by key in storage, null if it is not available
- `remove(key)` removes the stored value by key
- `clear()` removes all keys which are managed by this storage

e.g:
- on web application - the `IStorage` would be implemented by `WebStorage` which is a wrapper of `localStorage`
- on mobile application: TBD

## Resources

### Javascript
- Mnemonic - BIP39
  - https://github.com/bitcoinjs/bip39
- HDWallet:
  - https://github.com/cryptocoinjs/hdkey<br/>
  - https://github.com/alepop/ed25519-hd-key

### Java
- Mnemonic - BIP39 (BitcoinJ)
  - https://github.com/bitcoinj/bitcoinj/blob/master/core/src/main/java/org/bitcoinj/crypto/MnemonicCode.java
  - https://github.com/NovaCrypto
  - https://stackoverflow.com/questions/55622851/seed-from-bip39-mnemonic-not-matching-test-vectors
  - https://yenhuang.gitbooks.io/blockchain/content/hd-wallet.html
  - https://github.com/btchip/wallet/blob/master/public/bitlib/src/main/java/com/mrd/bitlib/crypto/Bip39.java
- HDWallet 
  - https://github.com/orogvany/BIP32-Ed25519-java
  - https://github.com/NovaCrypto/BIP32

# Swift
- https://github.com/skywinder/web3swift (secp)
- https://github.com/binance-chain/wallet-core-carthage/tree/master/wallet-core/swift/Sources/Generated/Enums

# C#
- https://github.com/farukterzioglu/HDWallet

# On-going implementation
- https://github.com/CasperDash/casper-storage
- Cover all test vectors which are provided by BIP32 and SLIP10
