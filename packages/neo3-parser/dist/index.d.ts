export interface Neo3Parser {
    /**
     * Converts an ArrayBuffer to an ASCII string.
     * @param buf
     */
    abToStr: (buf: ArrayBuffer | ArrayLike<number>) => string;
    /**
     * Converts an ASCII string into an arrayBuffer.
     * @param str
     */
    strToAb: (str: string) => Uint8Array;
    /**
     * Converts a hexstring into an arrayBuffer.
     * @param str
     */
    hexstringToAb: (str: string) => Uint8Array;
    /**
     * Converts an arraybuffer to hexstring.
     * @param arr
     */
    abToHexstring: (arr: ArrayBuffer | ArrayLike<number>) => string;
    /**
     * Converts an ascii string to hexstring.
     * @param str
     */
    strToHexstring: (str: string) => string;
    /**
     * Converts a hexstring to ascii string.
     * @param hexstring
     */
    hexstringToStr: (hexstring: string) => string;
    /**
     * convert an integer to big endian hex and add leading zeros.
     * @param num
     */
    intToHex: (num: number) => string;
    /**
     * Converts a number to a big endian hexstring of a suitable size, optionally little endian
     * @param num - a positive integer.
     * @param size - the required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
     * @param littleEndian - encode the hex in little endian form
     */
    numToHexstring: (num: number, size?: number, littleEndian?: boolean) => string;
    /**
     * Converts a number to a variable length Int. Used for array length header
     * @param num
     */
    numToVarInt: (num: number) => string;
    /**
     * Converts a hex string to a base64 string.
     * @param input
     */
    hexToBase64: (input: string) => string;
    /**
     * Converts a base64 string to hex
     * @param input
     */
    base64ToHex: (input: string) => string;
    /**
     * Converts an utf8 string to a base64 string.
     * @param input
     */
    utf8ToBase64: (input: string) => string;
    /**
     * Converts an ascii string to a base64 string.
     * @param input
     */
    asciiToBase64: (input: string) => string;
    /**
     * Converts a base64 string to utf8.
     * @param input
     */
    base64ToUtf8: (input: string) => string;
    /**
     * Converts an account input such Address, PublicKey or ScriptHash to an ScriptHash.
     * @param input
     */
    accountInputToScripthash: (input: string) => string;
    /**
     * Converts a string to base64
     * @param input The string to convert
     */
    strToBase64: (input: string) => string;
    /**
     * Converts an account input such Address, PublicKey or ScriptHash to an Address.
     * @param input
     */
    accountInputToAddress: (input: string) => string;
    /**
     * Reverses a HEX string, treating 2 chars as a byte.
     * @param input
     */
    reverseHex: (input: string) => string;
    /**
     * Formats the response from the RPC server to an easier to use format for dapp developers
     * @param input The response from the RPC server
     */
    parseRpcResponse: (field: RpcResponse, parseConfig?: ParseConfig) => any;
}
export interface ParseConfig {
    type: string;
    hint?: string;
    generic?: ParseConfig;
    genericKey?: ParseConfig;
    genericItem?: ParseConfig;
    union?: ParseConfig[];
}
export interface RpcResponse {
    type?: string;
    value?: string | RpcResponse[] | RpcResponse | boolean | number;
    key?: RpcResponse;
    sessionId?: string;
    id?: string;
    interface?: string;
}
export declare const INTERNAL_TYPES: {
    ARRAY: string;
    BYTESTRING: string;
    BUFFER: string;
    INTEGER: string;
    INTEROPINTERFACE: string;
    BOOLEAN: string;
    MAP: string;
    NULL: string;
    POINTER: string;
    STRUCT: string;
};
export declare const ABI_TYPES: {
    ANY: {
        name: string;
    };
    SIGNATURE: {
        name: string;
        internal: string;
    };
    BOOLEAN: {
        name: string;
        internal: string;
    };
    INTEGER: {
        name: string;
        internal: string;
    };
    HASH160: {
        name: string;
        internal: string;
    };
    HASH256: {
        name: string;
        internal: string;
    };
    BYTEARRAY: {
        name: string;
        internal: string;
    };
    PUBLICKEY: {
        name: string;
        internal: string;
    };
    STRING: {
        name: string;
        internal: string;
    };
    ARRAY: {
        name: string;
        internal: string;
    };
    MAP: {
        name: string;
        internal: string;
    };
    INTEROPINTERFACE: {
        name: string;
        internal: string;
    };
    VOID: {
        name: string;
        internal: string;
    };
};
export declare const HINT_TYPES: {
    ADDRESS: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    PUBLICKEY: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    SCRIPTHASH: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    SCRIPTHASHLITTLEENDING: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    BLOCKHASH: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    TRANSACTIONID: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    STORAGECONTEXT: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
    ITERATOR: {
        name: string;
        abi: {
            name: string;
            internal: string;
        };
    };
};
