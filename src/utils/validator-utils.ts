
const strongPwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*().])(?=.{10,})");

/**
 * Represents the result of a validation, with a status (true or false) and a message.
 */
export class ValidationResult {
  constructor(public status: boolean, public message: string = null) {
    if (!this.status && !this.message) {
      throw new Error("Invalid result should have a detail message");
    }
  }
}

/**
 * Provider utilities to validate data
 */
export class ValidatorUtils {

  /**
   * Verify a password is a strong one.
   * A strong password is a string which has 10 or more characters, which must contain at least a lowercase, an uppercase, a numeric and a special character.
   * @param pwd password to validate
   * @returns 
   */
  public static verifyStrongPassword(pwd: string): ValidationResult {
    if (!pwd) {
      return new ValidationResult(false, "Password is required");
    }

    if (!strongPwdRegex.test(pwd)) {
      return new ValidationResult(false, "Password length must be 10 or longer and it must contain at least a lowercase, an uppercase, a numeric and a special character");
    }

    return new ValidationResult(true);
  }
}