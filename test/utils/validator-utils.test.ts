import { ValidatorUtils } from "@/utils"

const ERROR_GENERAL = "Password length must be 10 or longer and it must contain at least a lowercase, an uppercase, a numeric and a special character";

test("ValidatorUtils.verifyStrongPassword-null", () => {
  const result = ValidatorUtils.verifyStrongPassword(null);
  expect(result.status).toBe(false);
  expect(result.message).toBe("Password is required");
})

test("ValidatorUtils.verifyStrongPassword-empty", () => {
  const result = ValidatorUtils.verifyStrongPassword("");
  expect(result.status).toBe(false);
  expect(result.message).toBe("Password is required");
})

test("ValidatorUtils.verifyStrongPassword-too-short-9-chars", () => {
  const result = ValidatorUtils.verifyStrongPassword("aaAAA129.");
  expect(result.status).toBe(false);
  expect(result.message).toBe(ERROR_GENERAL);
})

test("ValidatorUtils.verifyStrongPassword-no-lowercase", () => {
  const result = ValidatorUtils.verifyStrongPassword("AAAAAAAAAAAAAAAAAAAA123.");
  expect(result.status).toBe(false);
  expect(result.message).toBe(ERROR_GENERAL);
})

test("ValidatorUtils.verifyStrongPassword-no-uppercase", () => {
  const result = ValidatorUtils.verifyStrongPassword("aaaaaaaaaaaaaaaaaaa123.");
  expect(result.status).toBe(false);
  expect(result.message).toBe(ERROR_GENERAL);
})

test("ValidatorUtils.verifyStrongPassword-no-numeric", () => {
  const result = ValidatorUtils.verifyStrongPassword("aaaaaaaaaaaaaaaaaaaAAA.");
  expect(result.status).toBe(false);
  expect(result.message).toBe(ERROR_GENERAL);
})

test("ValidatorUtils.verifyStrongPassword-no-special-char", () => {
  const result = ValidatorUtils.verifyStrongPassword("aaaaaaaaaaaaaaaaaaaAAA1");
  expect(result.status).toBe(false);
  expect(result.message).toBe(ERROR_GENERAL);
})

test("ValidatorUtils.verifyStrongPassword-valid-10-chars", () => {
  const result = ValidatorUtils.verifyStrongPassword("aaaAAA129.");
  expect(result.status).toBe(true);
  expect(result.message).toBeFalsy();
})

test("ValidatorUtils.verifyStrongPassword-valid-12-chars", () => {
  const result = ValidatorUtils.verifyStrongPassword("AaaabAAA129.");
  expect(result.status).toBe(true);
  expect(result.message).toBeFalsy();
})

test("ValidatorUtils.verifyStrongPassword-valid-special-char-@", () => {
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129!").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129@").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129#").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129$").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129%").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129^").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129&").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129*").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129(").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129)").status).toBe(true);
  expect(ValidatorUtils.verifyStrongPassword("aaaAAA129.").status).toBe(true);
})
