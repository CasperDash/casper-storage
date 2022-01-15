# React-native
> Due to missing features of JavascriptCore, we need to polyfill, overrides some features

## Examples
1. `BigInt` is a primitive object which is only available for browsers and node environment
2. Text encoding functions
3. randombytes function

## [shim.js](https://github.com/CasperDash/casper-storage/blob/master/supports/react-native/shim.js)
Let's just copy the whole content and place it into your react-native project\
then import it to the main entry file\
> `import "./shim`