export interface Neo3Parser {
  /**
   * Converts an ArrayBuffer to an ASCII string.
   * @param buf
   */
  abToStr: (buf: ArrayBuffer | ArrayLike<number>) => string
  /**
   * Converts an ASCII string into an arrayBuffer.
   * @param str
   */
  strToAb: (str: string) => Uint8Array
  /**
   * Converts a hexstring into an arrayBuffer.
   * @param str
   */
  hexstringToAb: (str: string) => Uint8Array
  /**
   * Converts an arraybuffer to hexstring.
   * @param arr
   */
  abToHexstring: (arr: ArrayBuffer | ArrayLike<number>) => string
  /**
   * Converts an ascii string to hexstring.
   * @param str
   */
  strToHexstring: (str: string) => string
  /**
   * Converts a hexstring to ascii string.
   * @param hexstring
   */
  hexstringToStr: (hexstring: string) => string
  /**
   * convert an integer to big endian hex and add leading zeros.
   * @param num
   */
  intToHex: (num: number) => string
  /**
   * Converts a number to a big endian hexstring of a suitable size, optionally little endian
   * @param num - a positive integer.
   * @param size - the required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
   * @param littleEndian - encode the hex in little endian form
   */
  numToHexstring: (num: number, size?: number, littleEndian?: boolean) => string
  /**
   * Converts a number to a variable length Int. Used for array length header
   * @param num
   */
  numToVarInt: (num: number) => string
  /**
   * Converts a hex string to a base64 string.
   * @param input
   */
  hexToBase64: (input: string) => string
  /**
   * Converts a base64 string to hex
   * @param input
   */
  base64ToHex: (input: string) => string
  /**
   * Converts an utf8 string to a base64 string.
   * @param input
   */
  utf8ToBase64: (input: string) => string
  /**
   * Converts an ascii string to a base64 string.
   * @param input
   */
  asciiToBase64: (input: string) => string
  /**
   * Converts a base64 string to utf8.
   * @param input
   */
  base64ToUtf8: (input: string) => string
  /**
   * Converts an account input such Address, PublicKey or ScriptHash to an ScriptHash.
   * @param input
   */
  accountInputToScripthash: (input: string) => string
  /**
   * Converts a string to base64
   * @param input The string to convert
   */
  strToBase64: (input: string) => string
  /**
   * Converts an account input such Address, PublicKey or ScriptHash to an Address.
   * @param input
   */
  accountInputToAddress: (input: string) => string
  /**
   * Reverses a HEX string, treating 2 chars as a byte.
   * @param input
   */
  reverseHex: (input: string) => string
  /**
   * Formats the response from the RPC server to an easier to use format for dapp developers
   * @param input The response from the RPC server
   */
  parseRpcResponse: (field: RpcResponse, parseConfig?: ParseConfig) => any
}

export interface ParseConfig {
  type: string,
  hint?: string,
  generic?: ParseConfig,
  genericKey?: ParseConfig,
  genericItem?: ParseConfig,
  union?: ParseConfig[],
}

export interface RpcResponse{
  type?: string,
  value?: string | RpcResponse[] | RpcResponse | boolean | number,
  key?: RpcResponse
  sessionId?: string
  id?: string
  interface?: string
}

export const INTERNAL_TYPES = {
  ARRAY: "Array",
  BYTESTRING: "ByteString",
  BUFFER: "Buffer",
  INTEGER: "Integer",
  INTEROPINTERFACE: "InteropInterface",
  BOOLEAN: "Boolean",
  MAP: "Map",
  NULL: "Null",
  POINTER: "Pointer",
  STRUCT: "Struct",
}

export const ABI_TYPES = {
  ANY: {name: "Any"},
  SIGNATURE: {name: "Signature", internal: INTERNAL_TYPES.BYTESTRING},
  BOOLEAN: {name: "Boolean", internal: INTERNAL_TYPES.BOOLEAN},
  INTEGER: {name: "Integer", internal: INTERNAL_TYPES.INTEGER},
  HASH160: {name: "Hash160", internal: INTERNAL_TYPES.BYTESTRING},
  HASH256: {name: "Hash256", internal: INTERNAL_TYPES.BYTESTRING},
  BYTEARRAY: {name: "ByteArray", internal: INTERNAL_TYPES.BYTESTRING},
  PUBLICKEY: {name: "PublicKey", internal: INTERNAL_TYPES.BYTESTRING},
  STRING: {name: "String", internal: INTERNAL_TYPES.BYTESTRING},
  ARRAY: {name: "Array", internal: INTERNAL_TYPES.ARRAY},
  MAP: {name: "Map", internal: INTERNAL_TYPES.MAP},
  INTEROPINTERFACE: {name: "InteropInterface", internal: INTERNAL_TYPES.INTEROPINTERFACE},
  VOID: {name: "Void", internal: INTERNAL_TYPES.NULL},
}

export const HINT_TYPES = {
  ADDRESS: { name: "Address", abi: ABI_TYPES.STRING },
  PUBLICKEY:  { name: "PublicKey", abi: ABI_TYPES.PUBLICKEY },
  SCRIPTHASH: { name: "ScriptHash", abi: ABI_TYPES.HASH160 },
  SCRIPTHASHLITTLEENDING: { name: "ScriptHashLittleEndian", abi: ABI_TYPES.HASH160 },
  BLOCKHASH: { name: "BlockHash", abi: ABI_TYPES.HASH256 },
  TRANSACTIONID: { name: "TransactionId", abi: ABI_TYPES.HASH256 },
  STORAGECONTEXT: { name: "StorageContext", abi: ABI_TYPES.INTEROPINTERFACE },  
  ITERATOR: { name: "Iterator", abi: ABI_TYPES.INTEROPINTERFACE },             
}
