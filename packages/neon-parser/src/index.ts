import { Neo3Parser, ParseConfig } from '@cityofzion/neo3-parser'
import { u, wallet } from '@cityofzion/neon-js'

export const NeonParser: Neo3Parser = {
  abToHexstring(arr: ArrayBuffer | ArrayLike<number>): string {
    return u.ab2hexstring(arr)
  },
  abToStr(buf: ArrayBuffer | ArrayLike<number>): string {
    return u.ab2str(buf)
  },
  accountInputToAddress(input: string): string {
    return new wallet.Account(input).address
  },
  accountInputToScripthash(input: string): string {
    return new wallet.Account(input).scriptHash
  },
  base64ToHex: (input: string): string => {
    return u.base642hex(input)
  },
  base64ToUtf8(input: string): string {
    return u.base642utf8(input)
  },
  hexToBase64(input: string): string {
    return u.hex2base64(input)
  },
  hexstringToAb(str: string): Uint8Array {
    return u.hexstring2ab(str)
  },
  hexstringToStr(hexstring: string): string {
    return u.hexstring2str(hexstring)
  },
  intToHex(num: number): string {
    return u.int2hex(num)
  },
  numToHexstring(num: number, size: number | undefined, littleEndian: boolean | undefined): string {
    return u.num2hexstring(num, size, littleEndian)
  },
  numToVarInt(num: number): string {
    return u.num2VarInt(num)
  },
  reverseHex(input: string): string {
    return u.reverseHex(input)
  },
  strToAb(str: string): Uint8Array {
    return u.str2ab(str)
  },
  strToBase64: (input: string): string => {
    return u.hex2base64(u.str2hexstring(input))
  },
  strToHexstring(str: string): string {
    return u.str2hexstring(str)
  },
  utf8ToBase64(input: string): string {
    return u.utf82base64(input)
  },
  asciiToBase64(input: string): string {
    return u.HexString.fromAscii(input).toBase64()
  },
  parseRpcResponse(field: any, parseConfig?: ParseConfig): any {
    switch (field.type) {
      case "ByteString":
        const rawValue = NeonParser.base64ToHex(field.value)
        if (rawValue.length === 40 && parseConfig?.ByteStringToScriptHash) {
          return `0x${NeonParser.reverseHex(rawValue)}`
        }
        const asStr = NeonParser.hexstringToStr(rawValue)
        try {
          return JSON.parse(asStr)
        } catch (e) {
          return asStr
        }
      case "Integer":
        return parseInt(field.value)
      case "Array":
        return field.value.map( (f: any) => {
          return NeonParser.parseRpcResponse(f, parseConfig)
        })
      case "Map":
        const object: {
          [key: string]: any
        } = {}
        field.value.forEach((f: any) => {
          let key: string = NeonParser.parseRpcResponse(f.key, parseConfig)
          object[key] = NeonParser.parseRpcResponse(f.value, parseConfig)
        })
        return object
      default:
        try {
          return JSON.parse(field.value)
        } catch (e) {
          return field.value
        }
    }
  }
}
