"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonParser = void 0;
const neo3_parser_1 = require("@cityofzion/neo3-parser");
const neon_js_1 = require("@cityofzion/neon-js");
exports.NeonParser = {
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
        switch (field.type) {
            case "ByteString":
                return parseByteString(field, parseConfig);
            case "Integer":
                return parseInt(field.value);
            case "Array":
                return field.value.map((f) => {
                    return exports.NeonParser.parseRpcResponse(f, parseConfig.generic);
                });
            case "Map":
                const object = {};
                field.value.forEach((f) => {
                    let key = exports.NeonParser.parseRpcResponse(f.key, parseConfig.genericKey);
                    object[key] = exports.NeonParser.parseRpcResponse(f.value, parseConfig.genericItem);
                });
                return object;
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
function parseByteString({ value }, parseConfig) {
    const valueToParse = value;
    if (parseConfig.union) {
        for (const config of parseConfig.union) {
            if (neo3_parser_1.ABI_TYPES[config.type.toUpperCase()].internal === neo3_parser_1.INTERNAL_TYPES.BYTESTRING) {
                parseConfig = config;
                break;
            }
        }
    }
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type) === neo3_parser_1.ABI_TYPES.STRING.name) {
        const stringValue = exports.NeonParser.base64ToUtf8(valueToParse);
        if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.hint) === neo3_parser_1.EXTENDED_ABI_TYPES.ADDRESS.name &&
            (stringValue.length !== 34 ||
                (!stringValue.startsWith("N") && !stringValue.startsWith("A")))
        // veirfica se é base58 depois eua cho
        ) {
            throw new TypeError(`${valueToParse} is not an ${neo3_parser_1.EXTENDED_ABI_TYPES.ADDRESS.name}`);
        }
        return stringValue;
    }
    const rawValue = exports.NeonParser.base64ToHex(valueToParse);
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type) === neo3_parser_1.ABI_TYPES.HASH160.name) {
        if (rawValue.length !== 40)
            throw new TypeError(`${rawValue} is not a ${neo3_parser_1.ABI_TYPES.HASH160}`);
        return (parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.hint) === neo3_parser_1.EXTENDED_ABI_TYPES.SCRIPTHASHLITTLEENDING.name ? rawValue : `0x${exports.NeonParser.reverseHex(rawValue)}`;
    }
    if ((parseConfig === null || parseConfig === void 0 ? void 0 : parseConfig.type) === neo3_parser_1.ABI_TYPES.HASH256.name) {
        if (rawValue.length !== 64)
            throw new TypeError(`${rawValue} is not a ${neo3_parser_1.ABI_TYPES.HASH256}`);
        return `0x${exports.NeonParser.reverseHex(rawValue)}`;
    }
    return rawValue;
}
//# sourceMappingURL=index.js.map