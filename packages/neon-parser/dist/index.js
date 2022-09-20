"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonParser = void 0;
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
    addressToScripthash(input) {
        return neon_js_1.wallet.getScriptHashFromAddress(input);
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
    parseRpcResponse(field) {
        switch (field.type) {
            case "ByteString":
                const rawValue = neon_js_1.u.base642hex(field.value);
                if (rawValue.length === 40) {
                    return `0x${neon_js_1.u.reverseHex(rawValue)}`;
                }
                return neon_js_1.u.hexstring2str(rawValue);
            case "Integer":
                return parseInt(field.value);
            case "Array":
                return field.value.map((f) => {
                    return exports.NeonParser.parseRpcResponse(f);
                });
            case "Map":
                const object = {};
                field.value.forEach((f) => {
                    let key = exports.NeonParser.parseRpcResponse(f.key);
                    object[key] = exports.NeonParser.parseRpcResponse(f.value);
                });
                return object;
            default:
                return field.value;
        }
    }
};
