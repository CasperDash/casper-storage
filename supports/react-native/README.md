# React-native
> Due to missing features of JavascriptCore, we need to polyfill, overrides some features

## Examples
1. `BigInt` is a primitive object which is only available for browsers and node environment
2. Text encoding functions
3. randombytes function

## Guidelines

1. Install required dependencies
- big-integer
- react-native-randombytes

2. Copy the prepared "shim.js" and import it into the main entry file
[shim.js](https://github.com/CasperDash/casper-storage/blob/master/supports/react-native/shim.js)

```
import "./shim"
```