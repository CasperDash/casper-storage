import { Secp256k1 } from "@/cryptography/key/secp256k1"
import { TypeUtils } from "@/utils";

test("secp256k1.test.generatePrivateKey-ok", async () => {
  const privateKey = await Secp256k1.generatePrivateKey();
  expect(privateKey).not.toBeFalsy();
  expect(privateKey.length).toBe(32);
})

test("secp256k1.test.generatePrivateKey-ramdom", async () => {
  const generatedKeys = {};
  for (var i = 0; i < 1000; i++) {
    const privateKey = TypeUtils.convertArrayToHexString(await Secp256k1.generatePrivateKey());
    expect(generatedKeys[privateKey]).toBeFalsy();
    generatedKeys[privateKey] = true;
  }
})

test("secp256k1.createPublicKey-t1", async () => {
  expect(TypeUtils.parseHexToString(await Secp256k1.createPublicKey("edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea", true))).toBe("035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56");
})

test("secp256k1.createPublicKey-t2", async () => {
  expect(TypeUtils.parseHexToString(await Secp256k1.createPublicKey("3c6cb8d0f6a264c91ea8b5030fadaa8e538b020f0a387421a12de9319dc93368", true))).toBe("03501e454bf00751f24b1b489aa925215d66af2234e3891c3b21a52bedb3cd711c");
})