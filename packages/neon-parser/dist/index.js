"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeonParser = void 0;
const neon_js_1 = require("@cityofzion/neon-js");
exports.NeonParser = {
    stringToBase64: (input) => {
        return neon_js_1.u.hex2base64(neon_js_1.u.str2hexstring(input));
    },
    base64ToHex: (input) => {
        return neon_js_1.u.base642hex(input);
    },
    formatResponse(field) {
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
                    return exports.NeonParser.formatResponse(f);
                });
            case "Map":
                const object = {};
                field.value.forEach((f) => {
                    let key = exports.NeonParser.formatResponse(f.key);
                    object[key] = exports.NeonParser.formatResponse(f.value);
                });
                return object;
            default:
                return field.value;
        }
    }
};
