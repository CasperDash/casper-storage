# React-native ![visitors](https://visitor-badge.glitch.me/badge?page_id=casperdash.casper-storage-reactnative)
> Due to missing features of JavascriptCore, we need to pofyfill some core modules

## Examples
1. `BigInt` is a primitive object which is only available for browsers and node environment
2. Text encoding functions
3. Crypto related functions (randombytes, etc)

## Guidelines

1. Install required dependencies
```
yarn add casper-storage
yarn add @react-native-async-storage/async-storage
yarn add big-integer
```

2. Ensure that `metro-react-native-babel-preset` package is updated to latest version (>=0.70.2)

3. Update `package.json`, add a `postinstall` script
```json
{
  "postinstall": "rn-nodeify --install process,stream,crypto --hack"
}
```

or with yarn

```json
{
  "postinstall": "rn-nodeify --install process,stream,crypto --hack --yarn"
}
```

4. Ensure that you don't have a custom `shim.js` in root folder, if you do please rename it to another one (e.g myshim.js)

5. Install required dev-dependencies
```
yarn add -D rn-nodeify
```

6. When installing packages or run it manually, "shim.js" will be generated at root folder

```
yarn rn-nodeify --install process,stream,crypto --hack
```

Import it into the main entry file

```javascript
import "./shim"
```

7. Beside that, we also need to import another custom shim file

- Temporary fix for transformation (for ios) while waiting for metro to release the latest version
- Make TextEncoder methods be available at root object

Simply copy [shim-legacy.js](https://github.com/CasperDash/casper-storage/blob/master/supports/react-native/shim-legacy.js) to root folder and import into the main entry file, right after the `shim.js` in previous step

```javascript
import "./shim"
import "./shim-legacy"
```

## References

### [rn-nodeify](https://github.com/tradle/rn-nodeify)
Install shims for core modules

### [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
An asynchronous, unencrypted, persistent, key-value storage system for React Native.
