import { CryptoUtils, EncoderUtils } from ".";
import { TypeUtils, ValidationResult, ValidatorUtils } from "../utils";

export const defaultOptions = {
  /**
   * Recommneded iterations for PBKDF2-HMAC-SHA512
   */
  iterations: 120000,
  keySize: 16
};

/**
 * Default password validator function
 */
export const defaultValidator: IPasswordValidator = {
  validatorFunc: ValidatorUtils.verifyStrongPassword,
  validatorRegex: null
};

export interface IPasswordValidator {
  /**
  * A function to validate the password
  */
  validatorFunc?: (pwd: string) => ValidationResult;

  /**
   * A regex string to validate the password
   */
  validatorRegex?: string;
}

/**
 * Options to manage passwords and encryptions.
 */
export class PasswordOptions {

  private _password: string;

  constructor(password: string) {
    // Store the password in memory within user's session
    // We should not store the raw password in memory, let's hashing the user-given password
    this._password = TypeUtils.parseHexToString(CryptoUtils.hash256(EncoderUtils.encodeText(password)));
  }

  /* This is a getter function that returns the password. */
  public get password(): string {
    return this._password;
  }

}
