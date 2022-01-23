import { TypeUtils } from "@/utils";

test("convertArrayToHexString.null", () => {
  expect(TypeUtils.convertArrayToHexString(null)).toBeNull();
});

test("convertArrayToHexString.empty", () => {
  expect(TypeUtils.convertArrayToHexString(new Uint8Array())).toBe("");
});

test("convertArrayToHexString.test1", () => {
  expect(TypeUtils.convertArrayToHexString(new Uint8Array([1,0,2,5,10,124,255]))).toBe("010002050a7cff");
});

test("convertArrayToHexString.test2", () => {
  expect(TypeUtils.convertArrayToHexString(new Uint8Array([255,254,1,15,2]))).toBe("fffe010f02");
});


test("convertArrayToBinaryString.null", () => {
  expect(TypeUtils.convertArrayToBinaryString(null)).toBeNull();
});

test("convertArrayToBinaryString.empty", () => {
  expect(TypeUtils.convertArrayToBinaryString(new Uint8Array())).toBe("");
});

test("convertArrayToBinaryString.test1", () => {
  expect(TypeUtils.convertArrayToBinaryString(new Uint8Array([1,0,2,5,10,124,255]))).toBe("00000001000000000000001000000101000010100111110011111111");
});

test("convertArrayToBinaryString.test2", () => {
  expect(TypeUtils.convertArrayToBinaryString(new Uint8Array([255,254,1,15,2]))).toBe("1111111111111110000000010000111100000010");
});


test("convertHexStringToArray.null", () => {
  expect(TypeUtils.convertHexStringToArray(null)).toEqual(new Uint8Array());
});

test("convertHexStringToArray.empty", () => {
  expect(TypeUtils.convertHexStringToArray("")).toEqual(new Uint8Array());
});

test("convertHexStringToArray.test1", () => {
  expect(TypeUtils.convertHexStringToArray("010002050a7cff")).toEqual(new Uint8Array([1,0,2,5,10,124,255]));
});

test("convertHexStringToArray.test2", () => {
  expect(TypeUtils.convertHexStringToArray("fffe010f02")).toEqual(new Uint8Array([255,254,1,15,2]));
});

test("parseHexToArray.null", () => {
  expect(TypeUtils.parseHexToArray(null)).toBeNull();
});

test("parseHexToArray.empty", () => {
  expect(TypeUtils.parseHexToArray("")).toEqual(new Uint8Array());
});

test("parseHexToArray.hex-string", () => {
  expect(TypeUtils.parseHexToArray("fffe010f02")).toEqual(new Uint8Array([255,254,1,15,2]));
});

test("parseHexToArray.hex-array", () => {
  expect(TypeUtils.parseHexToArray(new Uint8Array([255,254,1,15,2]))).toEqual(new Uint8Array([255,254,1,15,2]));
});

test("parseHexToString.null", () => {
  expect(TypeUtils.parseHexToString(null)).toBeNull();
});

test("parseHexToString.empty", () => {
  expect(TypeUtils.parseHexToString("")).toEqual("");
});

test("parseHexToString.hex-string", () => {
  expect(TypeUtils.parseHexToString("fffe010f02")).toEqual("fffe010f02");
});

test("parseHexToString.hex-array", () => {
  expect(TypeUtils.parseHexToString(new Uint8Array([255,254,1,15,2]))).toEqual("fffe010f02");
});

test("isString.false", () => {
  expect(TypeUtils.isString(null)).toBe(false);
  expect(TypeUtils.isString(undefined)).toBe(false);
  expect(TypeUtils.isString(0)).toBe(false);
  expect(TypeUtils.isString(1)).toBe(false);
  expect(TypeUtils.isString(1.5)).toBe(false);
  expect(TypeUtils.isString(new Object())).toBe(false);
  expect(TypeUtils.isString(new Uint8Array())).toBe(false);
  expect(TypeUtils.isString(false)).toBe(false);
  expect(TypeUtils.isString(true)).toBe(false);
})

test("isString.true", () => {
  expect(TypeUtils.isString("")).toBe(true);
  expect(TypeUtils.isString("0")).toBe(true);
  expect(TypeUtils.isString("abc")).toBe(true);
})