import { KeyFactory } from "@/key";

test("getInstance.mnemonic-generate", () => {
  let keyMgr = KeyFactory.getInstance();
  let key = keyMgr.generate();
  expect(key).not.toBeNull();
})