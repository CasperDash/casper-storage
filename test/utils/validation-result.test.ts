import { ValidationResult } from "@/utils";

test("ValidationResult.ctor-true", () => {
  const result = new ValidationResult(true);
  expect(result.status).toBe(true);
  expect(result.message).toBeFalsy();
})

test("ValidationResult.ctor-false", () => {
  const result = new ValidationResult(false, "Msg");
  expect(result.status).toBe(false);
  expect(result.message).toBe("Msg");
})

test("ValidationResult.ctor-false-no-msg", () => {
  expect(() => new ValidationResult(false)).toThrowError("Invalid result should have a detail message");
})
