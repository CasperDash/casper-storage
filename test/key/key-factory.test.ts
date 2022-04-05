import { KeyFactory } from "../../src/key";

test("getInstance.default", () => {
  let keyMgr = KeyFactory.getInstance();
  let key = keyMgr.generate();
  expect(key).not.toBeNull();
})

test("getInstance.default-generate-default", () => {
  let keyMgr = KeyFactory.getInstance();
  let key = keyMgr.generate();
  expect(key.split(" ").length).toBe(12);
});
