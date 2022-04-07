# Casper storage [![CI](https://github.com/CasperDash/casper-storage/actions/workflows/ci-master.yml/badge.svg?branch=master)](https://github.com/CasperDash/casper-storage/actions/workflows/ci-master.yml) [![codecov](https://codecov.io/gh/CasperDash/casper-storage/branch/master/graph/badge.svg?token=9B1WI1WXGE)](https://codecov.io/gh/CasperDash/casper-storage)
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
1. In order to use work with keys, import the *KeyFactory* from *casper-storage*

``` javascript
import { KeyFactory } from "casper-storage";
const keyManager = KeyFactory.getInstance();
```

2. To generate a new random key (default is mnemonic provider)

``` javascript
keyManager.generate();
// output will be something like: basket pluck awesome prison unveil umbrella spy safe powder lock swallow shuffle

// By default, the outpult will a phrase with 12 words, we can ask for more
keyManager.generate(24);
```

3. To convert the key to a seed, so we can use in as a master seed for HD wallet

``` javascript
// Convert a master-key to a seed as a hex string
const seed: string = keyManager.toSeed("your keyphrase here");

// Convert a master-key to a seed as byte-array
const seed: Uint8Array = keyManager.toSeedArray("your keyphrase here");
```

4. To validate if a phrase is a valid key, following BIP39 standard

``` javascript
const isValid: boolean = keyManager.validate("your keyphrase here");
```

### Casper HD wallet (with keyphrase)

``` javascript
import { KeyFactory, EncryptionType, CasperHDWallet } from "casper-storage"
const keyManager = KeyFactory.getInstance();
```

1. Create a new keyphrase (master key), default is 24-words-length phrase

``` javascript
const masterKey = keyManager.generate()
```

2. Convert the master key to the master seed

``` javascript
const masterSeed = keyManager.toSeed(masterKey)
const masterSeedArray = keyManager.toSeedArray(masterKey)
```

3. Create a new instance HDWallet from the master seed (either hex value or array buffer), with desired encryption mode

``` javascript
const hdWallet = new CasperHDWallet(masterSeed, EncryptionType.Ed25519);
```

4. Get account 

``` javascript
const acc0 = await hdWallet.getAccount(0)
const acc1 = await hdWallet.getAccount(1)
```

5. Play with wallets

``` javascript
// Get the private key
acc0.getPrivateKey()

// Get the public key
await acc0.getPublicKey()

// Get the public address
await acc0.getPublicAddress()

// Get the public address's hash
await acc0.getPublicHash()
```

### Casper legacy wallet (with single private key)

``` javascript
import { KeyFactory, EncryptionType, CasperLegacyWallet } from "casper-storage"
```

1. Prepare a private key (input from user, or read from a file)

2. Create a new instance of CasperLegacyWallet with that private key (either hex string or Uint8Array data)

``` javascript
const wallet = new CasperLegacyWallet("a-private-key-hex-string", EncryptionType.Ed25519)
const wallet = new CasperLegacyWallet(privateUint8ArrayData, EncryptionType.Secp256k1)
```

3. This wallet will also share the same methods from a wallet of HDWallet

``` javascript
await wallet.getPublicAddress()
await acc0.getPublicHash()
```

### User

``` javascript
import { User } from "casper-storage"
```

1. Prepare a new user instance

``` javascript
const user = new User("user-password")
```

- **Important** The lib's using pbkdf2 for hashing the password, the consumer need to get the hashing options and store it in reliable storage. The wallet won't be accessible without hashing option

``` javascript
const hashingOptions = user.getPasswordHashingOptions()
```

- By default, user-password will be verified to ensure it is strong enough (at least 10 characters, including lowercase, uppercase, numeric and a special character)
we can override the validator by giving user options
``` javascript
// With a regex
const user = new User("user-password", {
    passwordOptions: {
      passwordValidatorRegex: "passwordRegexValidation",
    },
});

// or with a custom function
const user = new User("user-password", {
    passwordOptions: {
      passwordValidator: function (password) {
        if (!password || password.length <= 10) {
          return new ValidationResult(
            false,
            "Password length must be greater than or equal to 10"
          );
        } else {
          return new ValidationResult(true);
        }
      },
    },
});

// we can also update the password if needed
user.updatePassword("new-user-password");

// By default, new-user-password will be also verified to ensure it is strong enough
// we can override the validator by giving options
 user.updatePassword("new-user-password", {
    passwordOptions: {
      passwordValidatorRegex: "passwordRegexValidation",
    },
});
```

2. Set user's HD wallet with encryption type

``` javascript
// master-key is a keyphrase 12-24 words
user.setHDWallet("master-key", EncryptionType.Ed25519);

// we can retrieve back the master key
const masterKey = user.getHDWallet().keyphrase;
```

3. Add user's default first account

``` javascript
// We can call addWalletAccount
user.addWalletAccount(0, new WalletDescriptor("Account 1"));

// or if we have the wallet account already
const acc0 = await user.getWalletAccount(0);
user.setWalletInfo(acc0.getReferenceKey(), new WalletDescriptor("Account 1"));
```

4. Scan all available users's account (index from 1+, maximum up to 20 following BIP's standard) and add them into the user instance

5. Optional, add user's legacy wallets

``` javascript
const wallet = new LegacyWallet("user-wallet-private-key", EncryptionType.Ed25519);
user.addLegacyWallet(wallet, new WalletDescriptor("Legacy wallet 1"));
```

6. Retrieve all wallets to show on UI

``` javascript
// HDWallet account
user.getHDWallet().derivedWallets
// Legacy wallets
user.getLegacyWallets()
```

8. Each derived wallet or legacy wallet provides a WalletDescriptor with its detailed information

``` javascript
const name = user.getHDWallet().derivedWallets[0].descriptor.name
const name = user.getLegacyWallets()[0].descriptor.name
```

9. Serialize/Deserialize user's information

``` javascript
// Serialize the user information to a secure encrypted string 
const user = new User("user-password");
const userInfo = user.serialize();

// Deserialize the user information from a secure encrypted string
const user2 = new User("user-password", encryptedUserInfo, {
    passwordOptions: user.getPasswordHashingOptions(),
});

user2.deserialize("user-encrypted-information");
// or
const user2 = User.deserializeFrom("user-password", "user-encrypted-information", {
    passwordOptions: user.getPasswordHashingOptions(),
});

```

### Storage

``` javascript
import { StorageManager } from "casper-storage;
const storage = StorageManager.getInstance();

// Set item into storage
await storage.set("key", "value");

// Get items from storage
const value = await storage.get("key");

// Other utils
const exists = await storage.has("key");
await storage.remove("key");
await storage.clear();
```

### Misc
Parse exported PEM files from Casper signer

``` javascript
import { KeyParser } from "casper-storage";

// If you know exactly the encryption type, e.g Ed25519
const keyParser = KeyParser.getInstance(EncryptionType.Ed25519);
const keyValue = keyParser.convertPEMToPrivateKey(yourPEMContent);

// Otherwise, let it tries to guess
// It will try to detect encryption type, if not possible then it will throw an error
const keyParser = KeyParser.getInstance();
const keyValue = keyParser.convertPEMToPrivateKey(yourPEMContent);

// The keyValue exposes 2 properties
// Imported private-key
const key = keyValue.key;
// and its encryption type (EncryptionType.Ed25519 or EncryptionType.Secp256k1)
const encryptionType = keyValue.encryptionType;
```

## Progress
- [x] Key generator (mnemonic)
- [x] Cryptography
  - [x] Asymmetric key implementation
    - [x] Ed25519
    - [x] Secp256k1
  - [x] Utilities
    - [x] Common hash functions (HMAC, SHA256, SHA512, etc)
    - [x] AES encrypt/decrypt functions
    - [x] Encoder functions
- [x] Wallet
  - [x] HD wallet
  - [x] Legacy wallet
    - [x] Supports PEM files (which are exported from Casper signer)
- [x] User management
  - [x] Manage HD wallets, legacy wallets
  - [x] Serialize/Deserialize (encrypted) user's information
- [x] Storage management
  - [x] Cross-platform storage which supports web, react-native (iOS, Android)
