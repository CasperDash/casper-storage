/**
 * Encryption algorithm type to used in cryptography
 */
export enum EncryptionType {
    /**
     * Edwards-curve digital signature algorithm.
     * It is recommended to use this over Secp256k1 due to its security and performance.
     */
    Ed25519 = 'ed25519',

    /**
     * The common algorithm which is used by BitCoin, Ethereum
     */
    Secp256k1 = 'secp256k1'
}