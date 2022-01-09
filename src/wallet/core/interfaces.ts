import { IHDKey } from "@/bips/bip32/hdkey";
import { EncryptionType } from "@/cryptography";

/**
 * A specific generator to generate addresses
 */
export interface IAddressGenerator {

    /**
     * Generate the address from a public key
     * @param publicKey 
     */
    generate(publicKey: Uint8Array): string;
}

export interface IWallet<TKey> {
    key: TKey;
    encryptionType: EncryptionType;
    sign(message: Uint8Array): Promise<Uint8Array>;
}

export interface IWalletConstructor<TWallet extends IWallet<IHDKey>> {
    new(key: IHDKey, encryptionType: EncryptionType): TWallet;
}

export interface IHDWallet<TWallet> {

    /**
     * Returns the base wallet on base derivation path (purpose/coinType)
     */
    getMasterWallet(): Promise<TWallet>;

    /**
     * Returns the wallet at a specific account index based on base derivation path (purpose/coinType/accountIndex/change/walletIndex)
     * Where the default accountIndex will be 0, and change will be 0 (external)
     * @param walletIndex 
     */
    getWallet(accountIndex: number, internal: boolean, walletIndex: number): Promise<TWallet>;
}