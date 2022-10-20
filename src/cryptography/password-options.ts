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

/**
 * Options to validate password
 */
export interface IPasswordOptions {
  /* The number of iterations to use in the PBKDF2 function. */
  get iterations(): number;

  /* The size of the key in bits. */
  get keySize(): number;
}

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
export class PasswordOptions implements IPasswordOptions {

  private _password: string;
  private _iterations: number;
  private _keySize: number;

  constructor(password: string, passwordOptions?: Partial<IPasswordOptions>) {
    const options = { ...defaultOptions, ...passwordOptions };

    this._keySize = options.keySize;
    this._iterations = options.iterations;

    // Store the password in memory within user's session
    // We should not store the raw password in memory, let's hashing the user-given password
    this._password = TypeUtils.parseHexToString(CryptoUtils.hash256(EncoderUtils.encodeText(password)));
  }

  /* This is a getter function that returns the password. */
  public get password(): string {
    return this._password;
  }

  /* This is a getter function that returns the iterations. */
  public get iterations(): number {
    return this._iterations;
  }

  /* This is a getter function that returns the key size. */
  public get keySize(): number {
    return this._keySize;
  }

  /**
   * Returns all options to store in storage in order to retrieve back values later.
   */
  public getOptions(): IPasswordOptions {
    return {
      iterations: this.iterations,
      keySize: this.keySize
    };
  }
}
