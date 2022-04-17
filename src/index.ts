export * from "./utils";
export * from "./key";
export * from "./cryptography";
export * from "./wallet";
export * from "./user";
export * from "./storage";

// Replace the native implementaion of sha512 inside ed25519
// by the one from hashes, which can be polyfilled by rn-nodeify
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
ed.utils.sha512 = (msg) => Promise.resolve(sha512(msg))