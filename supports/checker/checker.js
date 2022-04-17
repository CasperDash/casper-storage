import { KeyFactory } from "casper-storage";
import { EncryptionType, CasperHDWallet, CasperLegacyWallet, } from "casper-storage";
import { User, StorageManager } from "casper-storage";
class BaseChecker {
    constructor(name) {
        this.name = name;
    }
    fail(error) {
        throw new Error(error);
    }
}
class KeyFactoryChecker extends BaseChecker {
    constructor() {
        super("KeyFactory");
    }
    async run() {
        const words = KeyFactory.getInstance().generate(12);
        if (words == null || !words.length) {
            this.fail("Unable to generate key phrase");
        }
        const wordsCount = words.split(" ").length;
        if (wordsCount !== 12) {
            this.fail(`Try to generate 12 words but received ${wordsCount} words. Words: ${words}`);
        }
    }
}
class HDWalletEd25519Checker extends BaseChecker {
    constructor() {
        super("HDWalletEd25519");
        this.seeder = "000102030405060708090a0b0c0d0e0f";
        this.masterPrivateKey = "2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7";
        this.masterPublicAddress = "01a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed";
    }
    async run() {
        const hdWallet = new CasperHDWallet(this.seeder, EncryptionType.Ed25519);
        const wallet = await hdWallet.getMasterWallet();
        const privKey = wallet.getPrivateKey();
        if (privKey !== this.masterPrivateKey) {
            this.fail(`The generated private key (${privKey}) doesn't match expectation ${this.masterPrivateKey}`);
        }
        const publicAddr = await wallet.getPublicAddress();
        if (publicAddr !== this.masterPublicAddress) {
            this.fail(`The generated public address key (${publicAddr}) doesn't match expectation ${this.masterPublicAddress}`);
        }
    }
}
class HDWalletSecp256k1Checker extends BaseChecker {
    constructor() {
        super("HDWalletSecp256k1");
        this.seeder = "000102030405060708090a0b0c0d0e0f";
        this.masterPrivateKey = "e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35";
        this.masterPublicAddress = "020339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2";
    }
    async run() {
        const hdWallet = new CasperHDWallet(this.seeder, EncryptionType.Secp256k1);
        const wallet = await hdWallet.getMasterWallet();
        const privKey = wallet.getPrivateKey();
        if (privKey !== this.masterPrivateKey) {
            this.fail(`The generated private key (${privKey}) doesn't match expectation ${this.masterPrivateKey}`);
        }
        const publicAddr = await wallet.getPublicAddress();
        if (publicAddr !== this.masterPublicAddress) {
            this.fail(`The generated public address key (${publicAddr}) doesn't match expectation ${this.masterPublicAddress}`);
        }
    }
}
class LegacyWalletEd25519Checker extends BaseChecker {
    constructor() {
        super("LegacyWalletEd25519");
        this.privateKey = "3076574b4cf46085ff9c887a21f6bca2e6ec162f7a0a72b4671c2d770da014a6";
        this.publicAddress = "01041da081d7ec39e20755a088c1c90987a496dd1062cda70771657f1103c77670";
    }
    async run() {
        const wallet = new CasperLegacyWallet(this.privateKey, EncryptionType.Ed25519);
        const publicAddr = await wallet.getPublicAddress();
        if (publicAddr !== this.publicAddress) {
            this.fail(`The generated public address key (${publicAddr}) doesn't match expectation ${this.publicAddress}`);
        }
    }
}
class LegacyWalletSecp256k1Checker extends BaseChecker {
    constructor() {
        super("LegacyWalletSecp256k1");
        this.privateKey = "06dc1d7d051969d411e966c6c02d3d025b586f6c1a9c5688efa168b5919708f4";
        this.publicAddress = "02027b8db8cf675252c61e3de6932b3ac790ba39f1e99275aa2d3f05496767fe37cf";
    }
    async run() {
        const wallet = new CasperLegacyWallet(this.privateKey, EncryptionType.Secp256k1);
        const publicAddr = await wallet.getPublicAddress();
        if (publicAddr !== this.publicAddress) {
            this.fail(`The generated public address key (${publicAddr}) doesn't match expectation ${this.publicAddress}`);
        }
    }
}
class StorageChecker extends BaseChecker {
    constructor() {
        super("Storage");
    }
    async run() {
        const store = StorageManager.getInstance();
        try {
            // No error
            await store.get("CheckerTestKey");
            // No error
            await store.set("CheckerTestKey", "TestValue");
            if (!(await store.has("CheckerTestKey"))) {
                this.fail("Unable to set key into storage");
            }
            const value = await store.get("CheckerTestKey");
            if (value !== "TestValue") {
                this.fail("Expected to get back TestValue but received " + value);
            }
        }
        finally {
            if (store && store.isAvailable()) {
                store.remove("CheckerTestKey");
            }
        }
    }
}
class UserChecker extends BaseChecker {
    constructor() {
        super("User");
        this.pwd = "Th1siSASt{ngP@ssw0rd.";
    }
    async run() {
        const user = new User(this.pwd);
        const hashing = user.getPasswordHashingOptions();
        const serializedInfo = user.serialize(true);
        const user2 = new User(this.pwd, {
            passwordOptions: hashing,
        });
        user2.deserialize(serializedInfo);
        const serializedInfo2 = user2.serialize(true);
        if (serializedInfo !== serializedInfo2) {
            this.fail("Failed to serialize/deserialize user information");
        }
    }
}
class CheckerStats {
    constructor() {
        this.details = [];
    }
    hasError() {
        for (const idx in this.details) {
            if (!this.details[idx].success) {
                return true;
            }
        }
        return false;
    }
    getSummary() {
        const msgs = this.details.map((x) => {
            let msg = "Check " + x.name + " in " + x.time + " miliseconds as ";
            if (x.success) {
                msg += "success";
            }
            else {
                msg += "FAIL because " + x.error;
            }
            return msg;
        });
        return msgs.join("\r\n");
    }
}
class CheckResult {
}
class LibraryChecker {
    constructor() {
        this.stats = new CheckerStats();
    }
    async run() {
        this.stats = new CheckerStats();
        await this.specificRun(new KeyFactoryChecker());
        await this.specificRun(new LegacyWalletSecp256k1Checker());
        await this.specificRun(new LegacyWalletEd25519Checker());
        await this.specificRun(new HDWalletSecp256k1Checker());
        await this.specificRun(new HDWalletEd25519Checker());
        await this.specificRun(new UserChecker());
        await this.specificRun(new StorageChecker());
        return this.stats;
    }
    async specificRun(checker) {
        const result = new CheckResult();
        result.name = checker.name;
        const startTime = new Date();
        try {
            await checker.run();
            result.success = true;
        }
        catch (error) {
            if (error instanceof Error)
                result.error = error.message;
            else
                result.error = String(error);
        }
        finally {
            result.time = new Date().getTime() - startTime.getTime();
        }
        this.stats.details.push(result);
    }
}
const stats = await new LibraryChecker().run();
stats.getSummary();