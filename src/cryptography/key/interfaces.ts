import { Hex } from "@/utils";

/**
 * Common interface for asymetric keys (ed25519, secp256k1).
 * To provdie all minimal and common functions
 */
export interface IAsymmetricKey {

  /**
   * Generate a random private key
   * @returns a random array value
   */
  generatePrivateKey(): Promise<Uint8Array>;

  /**
   * Create the public-key from a specific private key
   * @param privateKey 
   * @param compressed 
   */
  createPublicKey(privateKey: Hex, compressed?: boolean): Promise<Uint8Array>;

  /**
   * Tweat the public key by adding the private key
   * @param publicKey 
   * @param tweak 
   * @param compressed 
   */
  publicKeyTweakAdd(publicKey: Hex, tweak: Hex, compressed?: boolean): Promise<Uint8Array>;
}