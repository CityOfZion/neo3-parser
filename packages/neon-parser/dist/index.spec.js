"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const mocha_1 = require("mocha");
const assert = require("assert");
// describe('Neon-Parser Tests', function () {
//   this.timeout(60000)
//   it("converts Base64 to Hex and revert it", async () => {
//     assert.equal(NeonParser.reverseHex(NeonParser.base64ToHex('ateeXCdGd+AdYKWa5w8SikaAqlk=')), '59aa80468a120fe79aa5601de07746275c9ed76a')
//     return true
//   })
//   it("converts address to script hash", async () => {
//     assert.equal(NeonParser.accountInputToScripthash('NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr'), '857a247939db5c7cd3a7bb14791280c09e824bea')
//     return true
//   })
// })
(0, mocha_1.describe)('RPC Parser Tests', function () {
    (0, mocha_1.it)("Parse Address", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "ByteString",
            value: "Tk5MaTQ0ZEpOWHRETlNCa29mQjQ4YVRWWXRiMXpack5Fcw=="
        };
        const address = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "String", hint: "Address" });
        assert.deepEqual(address, "NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs");
    }));
    (0, mocha_1.it)("Parse invalid Address", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "ByteString",
            // Address will end up too short
            value: _1.NeonParser.hexToBase64('Nnnnnnnnnnnnnnnn')
        };
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "String", hint: "Address" }));
        // Address will be too big
        rpcResponse.value = _1.NeonParser.strToBase64('NnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnn');
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "String", hint: "Address" }));
        // Address shouldn't start with a letter that isn't 'A' or 'N'
        rpcResponse.value = _1.NeonParser.strToBase64('BNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs');
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "String", hint: "Address" }));
    }));
    (0, mocha_1.it)("Parse ScriptHash and ScriptHashLittleEndian", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "ByteString",
            value: "YUeato/VwsBLJU84LYTd8vXGfO0="
        };
        const scriptHash = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHash" });
        assert.deepEqual(scriptHash, "0xed7cc6f5f2dd842d384f254bc0c2d58fb69a4761");
        const scriptHashLilEndian = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHashLittleEndian" });
        assert.deepEqual(scriptHashLilEndian, "61479ab68fd5c2c04b254f382d84ddf2f5c67ced");
    }));
    (0, mocha_1.it)("Parse invalid ScriptHash and ScriptHashLittleEndian", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "ByteString",
            // ScriptHash will end up too short
            value: "YUeato/VwsBLJU84LvX="
        };
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHash" }));
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHashLittleEndian" }));
        // ScriptHash will be too big
        rpcResponse.value = _1.NeonParser.strToBase64('YUeato/VwsBLJU84LYTd8vXGfO00000=');
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHash" }));
        assert.throws(() => _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash160", hint: "ScriptHashLittleEndian" }));
    }));
    (0, mocha_1.it)("Parse BlockHash or TransactionId", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "ByteString",
            value: "/BSStl9lDDKg1cEWHNeQyJoiAXOgBcLe2n2xkec9UWw="
        };
        const blockHash = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash256", hint: "BlockHash" });
        const transactionId = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash256", hint: "TransactionId" });
        assert.deepEqual(transactionId, "0x6c513de791b17ddadec205a07301229ac890d71c16c1d5a0320c655fb69214fc");
        assert.deepEqual(blockHash, transactionId);
        // There isn't a different on how they are returned right now
        const hash256 = _1.NeonParser.parseRpcResponse(rpcResponse, { type: "Hash256" });
        assert.deepEqual(hash256, blockHash);
    }));
    // it("Parse ByteString without parseConfig", async () => {
    //   const rpcResponse = {
    //     type: "ByteString",
    //     value: "aaaaaa"
    //   }
    //   const bytesValue = NeonParser.parseRpcResponse(rpcResponse)
    //   assert.deepEqual(bytesValue, "aaa") 
    // })
    (0, mocha_1.it)("Parse Integer", () => __awaiter(this, void 0, void 0, function* () {
        const rpcResponse = {
            type: "Integer",
            value: "18"
        };
        const integer = _1.NeonParser.parseRpcResponse(rpcResponse);
        assert.deepEqual(integer, 18);
    }));
    (0, mocha_1.it)("Parse single type Array", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "Array",
            value: [
                {
                    type: "Integer",
                    value: "10"
                },
                {
                    type: "Integer",
                    value: "20"
                },
                {
                    type: "Integer",
                    value: "30"
                },
            ]
        };
        let array = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Array', generic: { type: "Integer" } });
        assert.deepEqual(array, [10, 20, 30]);
        rpcResponse = {
            type: "Array",
            value: [
                {
                    type: "ByteString",
                    value: _1.NeonParser.strToBase64("test")
                },
                {
                    type: "ByteString",
                    value: _1.NeonParser.strToBase64("array")
                },
                {
                    type: "ByteString",
                    value: _1.NeonParser.strToBase64("return")
                },
            ]
        };
        array = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Array', generic: { type: "String" } });
        assert.deepEqual(array, ['test', 'array', 'return']);
    }));
    (0, mocha_1.it)("Parse Union", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "ByteString",
            value: _1.NeonParser.strToBase64("test")
        };
        let union = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Any', union: [{ type: "String" }, { type: "Integer" }] });
        assert.deepEqual(union, 'test');
        rpcResponse = {
            type: "Integer",
            value: "12"
        };
        union = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Any', union: [{ type: "String" }, { type: "Integer" }] });
        assert.deepEqual(union, 12);
    }));
    (0, mocha_1.it)("Try parse same internal types with Union", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "ByteString",
            value: _1.NeonParser.strToBase64("test")
        };
        // It's not possible to definitly know the correct return of the same internal type, it will be the always try to get the first one
        assert.throws(() => { _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Any', union: [{ type: "Hash160", hint: "ScriptHash" }, { type: "String" }, { type: "Integer" }] }); });
    }));
    (0, mocha_1.it)("Parse multiple types Array", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "Array",
            value: [
                {
                    type: "Integer",
                    value: "10"
                },
                {
                    type: "ByteString",
                    value: _1.NeonParser.strToBase64("test")
                },
                {
                    type: "ByteString",
                    value: _1.NeonParser.strToBase64("parser")
                },
            ]
        };
        let array = _1.NeonParser.parseRpcResponse(rpcResponse, {
            type: 'Array',
            generic: {
                type: "Any",
                union: [
                    {
                        type: 'Integer'
                    },
                    {
                        type: 'String'
                    }
                ]
            }
        });
        assert.deepEqual(array, [10, 'test', 'parser']);
        rpcResponse = {
            type: "Array",
            value: [
                {
                    type: "Integer",
                    value: "10"
                },
                {
                    type: "ByteString",
                    value: "Tk5MaTQ0ZEpOWHRETlNCa29mQjQ4YVRWWXRiMXpack5Fcw"
                },
                {
                    type: "ByteString",
                    value: "TlozcHFuYzFoTU44RUhXNTVabkNudThCMndvb1hKSEN5cg=="
                },
            ]
        };
        array = _1.NeonParser.parseRpcResponse(rpcResponse, {
            type: 'Array',
            generic: {
                type: "Any",
                union: [
                    {
                        type: 'Integer'
                    },
                    {
                        type: 'String',
                        hint: "Address"
                    }
                ]
            }
        });
        assert.deepEqual(array, [10, 'NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs', 'NZ3pqnc1hMN8EHW55ZnCnu8B2wooXJHCyr']);
    }));
    (0, mocha_1.it)("Parse single type Map", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "Map",
            value: [
                {
                    key: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("unit")
                    },
                    value: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("test")
                    }
                },
                {
                    key: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("neo")
                    },
                    value: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("parser")
                    }
                },
            ]
        };
        let map = _1.NeonParser.parseRpcResponse(rpcResponse, {
            type: 'Array',
            genericKey: { type: 'String' }, genericItem: { type: "String" }
        });
        assert.deepEqual(map, { unit: 'test', neo: 'parser' });
    }));
    (0, mocha_1.it)("Parse multiple types Map", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            type: "Map",
            value: [
                {
                    key: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("unit")
                    },
                    value: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("test")
                    }
                },
                {
                    key: {
                        type: "ByteString",
                        value: _1.NeonParser.strToBase64("neo")
                    },
                    value: {
                        type: "Integer",
                        value: "123"
                    }
                },
            ]
        };
        let map = _1.NeonParser.parseRpcResponse(rpcResponse, {
            type: 'Array',
            genericKey: { type: 'String' }, genericItem: { type: "Any", union: [{ type: 'HASH256' }, { type: 'SIGNATURE' }] }
        });
        assert.deepEqual(map, { unit: 'test', neo: 123 });
    }));
    (0, mocha_1.it)("Parse Boolean", () => __awaiter(this, void 0, void 0, function* () {
        let rpcResponse = {
            "type": "Boolean",
            "value": true
        };
        let bool = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Boolean' });
        assert.deepEqual(bool, true);
        rpcResponse.value = false;
        bool = _1.NeonParser.parseRpcResponse(rpcResponse, { type: 'Boolean' });
        assert.deepEqual(bool, false);
    }));
});
//# sourceMappingURL=index.spec.js.map