import { Secp256k1 } from "../../../src/cryptography/key/secp256k1"
import { TypeUtils } from "../../../src/utils";

test("secp256k1.generatePrivateKey-ok", async () => {
  const privateKey = await Secp256k1.generatePrivateKey();
  expect(privateKey).not.toBeFalsy();
  expect(privateKey.length).toBe(32);
})

test("secp256k1.generatePrivateKey-ramdom", async () => {
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

test("secp256k1.publicKeyTweakAdd-t1", async () => {
  const result = await Secp256k1.publicKeyTweakAdd("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", true);
  expect(TypeUtils.parseHexToString(result)).toBe("03c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5");
});

test("secp256k1.publicKeyTweakAdd-t2", async () => {
  const result = await Secp256k1.publicKeyTweakAdd("037cbf3da5bb6fbcc9b1ed5b9878e841aa4008e662b783ca32e367a33631caa5bd", "03585169e9cd2237e2b18cca7f1ca8b73a19f03cabcedee1c5cd4db44bf14c255d", true);
  expect(TypeUtils.parseHexToString(result)).toBe("02837efb38e822a7800a764150c882d72bde3fcdee3ef77bf81495748e76af12ce");
});

test("secp256k1.publicKeyTweakAdd-t3", async () => {
  const result = await Secp256k1.publicKeyTweakAdd("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", true);
  expect(TypeUtils.parseHexToString(result)).toBe("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5");
});

test("secp256k1.publicKeyTweakAdd-failed", async () => {
  await expect(Secp256k1.publicKeyTweakAdd("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")).rejects.toThrowError();
})
