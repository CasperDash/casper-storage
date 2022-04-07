import { CryptoUtils, EncoderUtils } from "../cryptography";
import { TypeUtils, ValidatorUtils } from "../utils";
import { PasswordOptions } from "./core";

const defaultOptions = {
  passwordValidator: ValidatorUtils.verifyStrongPassword,
  iterations: 100,
  keySize: 512 / 32,
};

export class Password {
  private password: string;
  private salt: Uint8Array;
  private iterations: number;
  private keySize: number;

  constructor(password: string, passwordOptions?: Partial<PasswordOptions>) {
    const options = { ...defaultOptions, ...passwordOptions };
    if (options.passwordValidator) {
      const result = options.passwordValidator(password);
      if (!result.status) {
        throw new Error(result.message);
      }
    }
    if (options.passwordValidatorRegex) {
      if (!new RegExp(options.passwordValidatorRegex).test(password)) {
        throw new Error("Password is not strong enough");
      }
    }

    // should generate random salt here, it'll get the same salt if put the code in default options
    this.salt = options.salt || CryptoUtils.randomBytes(16);
    this.iterations = options.iterations;
    this.keySize = options.keySize;
    // We should not store the raw password in memory, let's hashing the user-given password
    this.password = TypeUtils.convertArrayToHexString(
      CryptoUtils.pbkdf2Sync(
        EncoderUtils.encodeText(password),
        this.salt,
        this.iterations,
        this.keySize
      )
    );
  }

  /* This is a getter function that returns the password. */
  public getPassword = () => this.password;

  /* This is a getter function that returns the salt. */
  public getSalt = () => this.salt;

  /* This is a getter function that returns the iterations. */
  public getIterations = () => this.iterations;

  /* This is a getter function that returns the key size. */
  public getKeySize = () => this.keySize;
}
