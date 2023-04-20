"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonParser = void 0;
const neo3_parser_1 = require("@cityofzion/neo3-parser");
const neon_js_1 = require("@cityofzion/neon-js");
const NeonParser = {
    abToHexstring(arr) {
        return neon_js_1.u.ab2hexstring(arr);
    },
    abToStr(buf) {
        return neon_js_1.u.ab2str(buf);
    },
    accountInputToAddress(input) {
        return new neon_js_1.wallet.Account(input).address;
    },
    accountInputToScripthash(input) {
        return new neon_js_1.wallet.Account(input).scriptHash;
    },
    base64ToHex: (input) => {
        return neon_js_1.u.base642hex(input);
    },
    base64ToUtf8(input) {
        return neon_js_1.u.base642utf8(input);
    },
    hexToBase64(input) {
        return neon_js_1.u.hex2base64(input);
    },
    hexstringToAb(str) {
        return neon_js_1.u.hexstring2ab(str);
    },
    hexstringToStr(hexstring) {
        return neon_js_1.u.hexstring2str(hexstring);
    },
    intToHex(num) {
        return neon_js_1.u.int2hex(num);
    },
    numToHexstring(num, size, littleEndian) {
        return neon_js_1.u.num2hexstring(num, size, littleEndian);
    },
    numToVarInt(num) {
        return neon_js_1.u.num2VarInt(num);
    },
    reverseHex(input) {
        return neon_js_1.u.reverseHex(input);
    },
    strToAb(str) {
        return neon_js_1.u.str2ab(str);
    },
    strToBase64: (input) => {
        return neon_js_1.u.hex2base64(neon_js_1.u.str2hexstring(input));
    },
    strToHexstring(str) {
        return neon_js_1.u.str2hexstring(str);
    },
    utf8ToBase64(input) {
        return neon_js_1.u.utf82base64(input);
    },
    asciiToBase64(input) {
        return neon_js_1.u.HexString.fromAscii(input).toBase64();
    },
    parseRpcResponse(field, parseConfig) {
        var _a;
        verifyParseConfigUnion(field, parseConfig);
        switch ((_a = field.type) === null || _a === void 0 ? void 0 : _a.toUpperCase()) {
            case "BYTESTRING":
                return parseByteString(field, parseConfig);
            case "INTEGER":
                return parseInt(field.value);
            case "ARRAY":
                return field.value.map((f) => {
                    return NeonParser.parseRpcResponse(f, parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.generic);
                });
            case "MAP":
                const object = {};
                field.value.forEach((f) => {
                    let key = NeonParser.parseRpcResponse(f.key, parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.genericKey);
                    object[key] = NeonParser.parseRpcResponse(f.value, parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.genericItem);
                });
                return object;
            // Another method should take care of this parse
            case "INTEROPINTERFACE":
                return;
            default:
                try {
                    return JSON.parse(field.value);
                }
                catch (e) {
                    return field.value;
                }
        }
    }
};
exports.NeonParser = NeonParser;
function verifyParseConfigUnion(field, parseConfig) {
    if (parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.union) {
        const configs = parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.union.filter((config) => {
            return neo3_parser_1.ABI_TYPES[config.type.toUpperCase()].internal.toUpperCase() === field.type.toUpperCase();
        });
        if (configs.length > 0) {
            if (field.type.toUpperCase() === "Array".toUpperCase()) {
                parseConfig.generic = configs[0].generic;
            }
            else if (field.type.toUpperCase() === "Map".toUpperCase()) {
                parseConfig.genericItem = configs[0].genericItem;
                parseConfig.genericKey = configs[0].genericKey;
            }
            else if (field.type.toUpperCase() === "ByteString".toUpperCase()) {
                if (configs.length === 1) {
                    Object.assign(parseConfig, configs[0]);
                }
                else {
                    parseConfig.type = 'String';
                }
            }
            else {
                Object.assign(parseConfig, configs[0]);
            }
        }
    }
}
function parseByteString({ value }, parseConfig) {
    var _a, _b;
    const valueToParse = value;
    const rawValue = NeonParser.base64ToHex(valueToParse);
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type.toUpperCase()) === neo3_parser_1.ABI_TYPES.BYTEARRAY.name.toUpperCase()) {
        return rawValue;
    }
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type.toUpperCase()) === neo3_parser_1.ABI_TYPES.HASH160.name.toUpperCase()) {
        if (rawValue.length !== 40)
            throw new TypeError(`${rawValue} is not a ${neo3_parser_1.ABI_TYPES.HASH160.name}`);
        return ((_a = parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.hint) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === neo3_parser_1.HINT_TYPES.SCRIPTHASHLITTLEENDING.name.toUpperCase()
            ? rawValue : `0x${NeonParser.reverseHex(rawValue)}`;
    }
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type.toUpperCase()) === neo3_parser_1.ABI_TYPES.HASH256.name.toUpperCase()) {
        if (rawValue.length !== 64)
            throw new TypeError(`${rawValue} is not a ${neo3_parser_1.ABI_TYPES.HASH256.name}`);
        return `0x${NeonParser.reverseHex(rawValue)}`;
    }
    const stringValue = NeonParser.base64ToUtf8(valueToParse);
    if (((_b = parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.hint) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === neo3_parser_1.HINT_TYPES.ADDRESS.name.toUpperCase() &&
        (stringValue.length !== 34 ||
            (!stringValue.startsWith("N") && !stringValue.startsWith("A")) ||
            !stringValue.match(/^[A-HJ-NP-Za-km-z1-9]*$/) // check base58 chars
        )) {
        throw new TypeError(`${valueToParse} is not an ${neo3_parser_1.HINT_TYPES.ADDRESS.name}`);
    }
    return stringValue;
}
//# sourceMappingURL=index.js.map