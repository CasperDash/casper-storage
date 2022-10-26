# Casper storage [![CI](https://github.com/CasperDash/casper-storage/actions/workflows/ci-master.yml/badge.svg?branch=master)](https://github.com/CasperDash/casper-storage/actions/workflows/ci-master.yml) [![codecov](https://codecov.io/gh/CasperDash/casper-storage/branch/master/graph/badge.svg?token=9B1WI1WXGE)](https://codecov.io/gh/CasperDash/casper-storage) ![visitors](https://visitor-badge.glitch.me/badge?page_id=casperdash.casper-storage)

> Following crypto standard libraries, BIPs, SLIPs, etc this library provides a generic solution which lets developers have a standard way to manage wallets

[Technical document](https://casperdash.github.io/casper-storage/)

[Audited](#audit) by an independent security firm

## Setup

### NPM

```batch
npm install casper-storage

// or

yarn add casper-storage
```

### Browser

```
<script src="https://cdn.jsdelivr.net/npm/casper-storage"></script>
```

```html
<script>
  const wallet = new CasperStorage.CasperHDWallet("master-key", CasperStorage.EncryptionType.Ed25519);
</script>
```

### React-native
> Due to missing features of JavascriptCore, we need to polyfill and override some features (e.g randombytes, encoding, etc)

[Click here](https://github.com/CasperDash/casper-storage/blob/master/supports/react-native/README.md) for more detailed information

## Table of contents

- [Scenarios](#scenarios)
- [Usage](#usage)
  - [Key-phrase generator](#key-generator)
  - [Casper HD wallet](#casper-hd-wallet)
    - [Access properties of wallets](#wallet-properties)
  - [Casper legacy wallet](#casper-legacy-wallet)
    - [Access properties of wallets](#legacy-wallet-properties)
  - [User](#user)
    - [Create a new user](#user-create)
    - [Add wallets to user](#user-add-wallets)
    - [Retrieve wallets from user](#user-get-wallets)
    - [Understand wallet information](#user-walletinfo)
    - [Serialize/Deserialize user's information](#user-info)
  - [Storage](#storage)
  - [Misc](#misc)
    - [Export to PEM format](#misc-export-pem)
    - [Parse PEM files](#misc-parse-pem)
- [Development](#development)
- [Progress](#progress)

## Scenarios <a name="scenarios"></a>

A new user (Alice) accesses a wallet management (`CasperWallet`) for the very first time

- Alice asks for a new wallet

- `CasperWallet` generates 12-words keyphrase and shows her on the next screen, then asks her to back-up it (by writing down)

```javascript
import { KeyFactory } from "casper-storage";

const keyphrase = KeyFactory.getInstance().generate();
// Example: "picture sight smart spike squeeze invest rose need basket error garden ski"
```

- Alice confirms she keeps this master keyphrase in a safe place

- `CasperWallet` asks her to choose an `encryption mode` (either secp256k1 or ed25519) 
> `CasperWallet` recommends her to choose `ed25519` over secp256k1 due to security and performance, unless Alice explicitly wants to use secp256k1 because of Bitcoin, Ethereum compatible 

```javascript
import { EncryptionType } from "casper-storage"

const encryptionType = EncryptionType.Ed25519;
```

- `CasperWallet` asks her for a **secure** `password`, Alice gives `Abcd1234` and `CasperWallet` tries to intialize a `User` instance

```javascript
import { User } from "caper-storage";

// Alice's password
const password = "Abcd1234";

// Initialize a new user with password
const user = new User(password);
```

- `CasperWallet` rejects because the given password is not strong enough

- `CasperWallet` asks her to give another one which is stronger and more **secure**

- Alice gives `AliP2sw0rd.1` and `CasperWallet` re-tries

```javascript
const password = "AliP2sw0rd.1";

const user = new User(password);

// Successfully created the user instance, let's set the HDWallet information
user.setHDWallet(keyphrase, encryptionType);
```

- `CasperWallet` creates the first wallet account

```javascript
const wallet = await user.addWalletAccount(0, new WalletDescriptor("Account 1"));
```

- `CasperWallet` serializes user's information and store it into storage

```javascript
import { Storage } from "casper-storage";

const userInfo = user.serialize();
await Storage.getInstance().set("casperwallet_userinformation", userInfo);
```

- Alice renames her first account to "Salary account"

```javascript
const wallet = await user.getWalletAccount(0);
user.setWalletInfo(wallet.getReferenceKey(), "Salary account");

const userInfo = user.serialize();
await Storage.getInstance().set("casperwallet_userinformation", userInfo);
```

- Alice locks her wallet

- Alice comes back, `CasperStorage` asks for the password. Assuming that she gives the right password, `CasperStorage` retrieves back the user's information

```javascript
import { Storage, User } from "casper-storage";

const userInfo = await Storage.getInstance().get("casperwallet_userinformation");

const user = new User(password);
user.deserialize(userInfo);
```

## Usage <a name="usage"></a>

### Key generator <a name="key-generator"></a>
1. In order to work with keys, import the *KeyFactory* from *casper-storage*

``` javascript
import { KeyFactory } from "casper-storage";
const keyManager = KeyFactory.getInstance();
```

2. To generate a new random key (default is mnemonic provider)

``` javascript
keyManager.generate();
// output will be something like: basket pluck awesome prison unveil umbrella spy safe powder lock swallow shuffle

// By default, the outpult will be a phrase with 12 words, we can ask for more
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

### Casper HD wallet (with keyphrase) <a name="casper-hd-wallet"></a>

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

5. Play with wallets <a name="wallet-properties"></a>

``` javascript
// Get the private key of wallet
acc0.getPrivateKey()

// Get the raw public key of wallet, which is computed, untouched data from private key
await acc0.getRawPublicKey()

// Get the public key of wallet, which is alternated depends on the chain
// For examples: Casper will prefix 01 or 02 depends on the encryption type
await acc0.getPublicKey()

// Get the public address of wallet, which is computed from public key
await acc0.getPublicAddress()
```

### Casper legacy wallet (with single private key) <a name="casper-legacy-wallet"></a>

``` javascript
import { KeyFactory, EncryptionType, CasperLegacyWallet } from "casper-storage"
```

1. Prepare a private key (input from user, or read from a file)

2. Create a new instance of CasperLegacyWallet with that private key (either hex string or Uint8Array data)

``` javascript
const wallet = new CasperLegacyWallet("a-private-key-hex-string", EncryptionType.Ed25519)
const wallet = new CasperLegacyWallet(privateUint8ArrayData, EncryptionType.Secp256k1)
```

> If users have PEM files (which are exported from casper-signer), we need to use [KeyParser](#misc-parse-pem) to parse it into a hex private string.

3. This wallet will also share the same methods from a wallet of HDWallet <a name="legacy-wallet-properties"></a>

``` javascript
await wallet.getPublicKey()
await wallet.getPublicAddress()
```

### User <a name="user"></a>

``` javascript
import { User } from "casper-storage"
```

1. Prepare a new user instance <a name="user-create"></a>

``` javascript
const user = new User("user-password")
```

- By default, user-password will be verified to ensure it is strong enough (at least 10 characters, including lowercase, uppercase, numeric and a special character)
we can override the validator by giving user options
``` javascript
// With a regex
const user = new User("user-password", {
    passwordValidator: {
      validatorRegex: "passwordRegexValidation",
    }
});

// or with a custom function
const user = new User("user-password", {
    passwordValidator: {
      validatorFunc: function (password) {
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
    passwordValidator: {
      validatorRegex: "passwordRegexValidation",
    }
});
```

2. Set user's HD wallet with encryption type

``` javascript
// master-key is a keyphrase 12-24 words
user.setHDWallet("master-key", EncryptionType.Ed25519);

// we can retrieve back the master key
const masterKey = user.getHDWallet().keyphrase;
```

3. Add user's default first account <a name="user-add-wallets"></a>

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

6. Retrieve all wallets to show on UI <a name="user-get-wallets"></a>

``` typescript
// HDWallet account
const walletsInfo: WalletInfo[] = user.getHDWallet().derivedWallets;
// Legacy wallets
const legacyWalletsInfo: WalletInfo[] = user.getLegacyWallets();

// Wallet infornation
const walletInfo: WalletInfo  = walletsInfo[0];
const refKey: string = walletInfo.key;
const encryptionType: EncryptionType = walletInfo.encryptionType;
const name: string = walletInfo.descriptor.name;

// Construct HD wallet's accounts
const wallet: IWallet<IHDKey> = await user.getWalletAccountByRefKey(refKey);
// or
const wallet: IWallet<IHDKey> = await user.getWalletAccount(walletInfo.index); // only for HD wallets

// Construct legacy wallet
const legacyWalletInfo = legacyWalletsInfo[0];
const wallet = new CasperLegacyWallet(legacyWalletInfo.key, legacyWalletInfo.encryptionType);
```

7. Understand and retrieve information of wallets (`WalletInfo`) <a name="user-walletinfo"></a>

> `WalletInfo` represents a legacy wallet or a derived HD wallet, which is available in `User`

- Each `WalletInfo` contains 2 main things
  - Encryption type and id/uid
    - id is the private key of a legacy wallet or path of a HD wallet
    - uid is the hashed of id, which is secured to store in any storage
  - Descriptor (name, icon, description)

```typescript
// Asume that we have the wallet infornation at anytime
const storedWalletInfo: WalletInfo  = walletsInfo[0];

// We store either id/uid to storage
const id = storedWalletInfo.id;
const uid = storedWalletInfo.uid;

// We have 2 ways to retrieve back wallet information
const walletInfo: WalletInfo = user.getWalletInfo(storedWalletInfo.id);
const walletInfo: WalletInfo = user.getWalletInfo(storedWalletInfo.uid);

// Both above calls return the same instance
// However we recommend developers to store `uid` of wallet info,
// and use it to retrieve back information from user later
```

8. Serialize/Deserialize user's information <a name="user-info"></a>

``` javascript
// Serialize the user information to a secure encrypted string 
const user = new User("user-password");
const userInfo = user.serialize();

// Deserialize the user information from a secure encrypted string
const user2 = new User("user-password", encryptedUserInfo);

user2.deserialize("user-encrypted-information");
// or
const user2 = User.deserializeFrom("user-password", "user-encrypted-information");

// In additional, User also exposes 2 methods to encrypt/decrypt data with user's password
const encryptedText = user.encrypt("Raw string value");
const decryptedText = user.decrypt(encryptedText);
```

### Storage <a name="storage"></a>

``` javascript
import { StorageManager } from "casper-storage";

// Create a secured password
const password = new Password("Abcd1234.");

// Retrieve a secured storage with your password
const storage = StorageManager.getInstance(password);

// In the other hand, user also exposes getting storage method
const storage = user.getStorage();

// Set item into storage
await storage.set("key", "value");

// Get items from storage
const value = await storage.get("key");

// Update password, it will automatically re-sync existing keys
await storage.updatePassword(newPassword);
// or while updating password for user, existing keys will also be re-synced automatically
await user.updatePassword(newPassword);

// Other utils
const exists = await storage.has("key");
await storage.remove("key");
await storage.clear();
```

### Misc <a name="misc"></a>

Get private keys in PEM formats <a name="misc-export-pem"></a>

``` javascript
const pem = wallet.getPrivateKeyInPEM();
```

Parse exported PEM files from Casper signer <a name="misc-parse-pem"></a>

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

## Security <a name="audit"></a>

Casper-storage is production-ready

- The library has been audited by [Cure53](https://cure53.de/), an independent security film
- Pentest report and fix confirmation: [PDF](https://github.com/CasperDash/casper-storage/blob/master/document/audit/CAS-01-report.pdf)

## Development <a name="development"></a>

### Requirements and toolings

- LTS node 16x
- `yarn` to manage packages (`npm install -g yarn`)
- `typescript` tooling to develop
- `jest` to write unit-tests

### Basic commands

- `yarn lint` to ensure coding standards
- `yarn test` to run tests
- `yarn testci` to run tests with test coverage
- `yarn build` to compile `typescript` to `javascript` with declarations
- `yarn build-all` to build the library to final output
- `yarn docs` to generate document with `typedoc`

## Progress <a name="progress"></a>

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

## License
Apache License 2.0
