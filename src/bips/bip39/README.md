# BIP39

Build from [bip39](https://github.com/bitcoinjs/bip39) - include only English words

> browserify -r bip39 -s bip39 --exclude=./wordlists/japanese.json --exclude=./wordlists/spanish.json --exclude=./wordlists/italian.json --exclude=./wordlists/french.json --exclude=./wordlists/korean.json --exclude=./wordlists/czech.json --exclude=./wordlists/portuguese.json --exclude=./wordlists/chinese_traditional.json --exclude=./wordlists/chinese_simplified.json > bip39.browser.js