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
     * Converts a utf8 string to a base64 string.
     * @param input
     */
    utf8ToBase64: (input: string) => string;
    /**
     * Converts a base64 string to utf8.
     * @param input
     */
    base64ToUtf8: (input: string) => string;
    /**
     * Converts an address to scripthash.
     * @param input
     */
    addressToScripthash: (input: string) => string;
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
    parseRpcResponse: (field: any) => any;
}
