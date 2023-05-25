import {
  Neo3Parser, ParseConfig, RpcResponse,
  ABI_TYPES, HINT_TYPES
} from '@cityofzion/neo3-parser'
import { u, wallet } from '@cityofzion/neon-js'


const NeonParser: Neo3Parser = {
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
  parseRpcResponse(field: RpcResponse, parseConfig?: ParseConfig): any {
    verifyParseConfigUnion(field, parseConfig)

    switch (field.type?.toUpperCase()) {
      case "BYTESTRING":
        return parseByteString(field, parseConfig)
      case "INTEGER":
        return parseInt(field.value as string)
      case "ARRAY":
        return (field.value as RpcResponse[]).map( (f: any) => {
          return NeonParser.parseRpcResponse(f, parseConfig?.generic)
        })
      case "MAP":
        const object: {
          [key: string]: any
        } = {};

        (field.value as RpcResponse[]).forEach((f: any) => {
          let key: string = NeonParser.parseRpcResponse(f.key, parseConfig?.genericKey)
          object[key] = NeonParser.parseRpcResponse(f.value, parseConfig?.genericItem)
        })
        return object

      // Another method should take care of this parse
      case "INTEROPINTERFACE":
        return
      default:
        try {
          return JSON.parse(field.value as string)
        } catch (e) {
          return field.value
        }
    }
  }
}

function verifyParseConfigUnion(field: RpcResponse, parseConfig?: ParseConfig) {

  if (parseConfig?.union){
    const configs = parseConfig?.union.filter( (config) => {
      return ABI_TYPES[config.type.toUpperCase()].internal.toUpperCase() === field.type.toUpperCase()
    })

    if (configs.length > 0){
      if (field.type.toUpperCase() === "Array".toUpperCase()){
        parseConfig.generic = configs[0].generic
      }else if (field.type.toUpperCase() === "Map".toUpperCase()) {
        parseConfig.genericItem = configs[0].genericItem
        parseConfig.genericKey = configs[0].genericKey
      }else if (field.type.toUpperCase() === "ByteString".toUpperCase()) {
        if (configs.length === 1){
          Object.assign(parseConfig, configs[0])
        } else{
          parseConfig.type = 'String'
        }
      }else{
        Object.assign(parseConfig, configs[0])
      }
    }
  }
}

function parseByteString({value}: RpcResponse, parseConfig?: ParseConfig) {
  const valueToParse = value as string

  const rawValue = NeonParser.base64ToHex(valueToParse)

  if (parseConfig?.type.toUpperCase() === ABI_TYPES.BYTEARRAY.name.toUpperCase()){
    return rawValue
  }

  if (parseConfig?.type.toUpperCase() === ABI_TYPES.HASH160.name.toUpperCase()) {
    if (rawValue.length !== 40) throw new TypeError(`${rawValue} is not a ${ABI_TYPES.HASH160.name}`)

    return parseConfig?.hint?.toUpperCase() === HINT_TYPES.SCRIPTHASHLITTLEENDING.name.toUpperCase()
      ? rawValue : `0x${NeonParser.reverseHex(rawValue)}`
  }

  if (parseConfig?.type.toUpperCase() === ABI_TYPES.HASH256.name.toUpperCase()) {
    if (rawValue.length !== 64) throw new TypeError(`${rawValue} is not a ${ABI_TYPES.HASH256.name}`)

    return `0x${NeonParser.reverseHex(rawValue)}`
  }

  let stringValue

  try {
    stringValue = NeonParser.base64ToUtf8(valueToParse)
  } catch (e) {
    return valueToParse
  }

  if (parseConfig?.hint?.toUpperCase() === HINT_TYPES.ADDRESS.name.toUpperCase() &&
    (
      stringValue.length !== 34 ||
      (!stringValue.startsWith("N") && !stringValue.startsWith("A") ) ||
      !stringValue.match(/^[A-HJ-NP-Za-km-z1-9]*$/) // check base58 chars
    )
  ){
    throw new TypeError(`${valueToParse} is not an ${HINT_TYPES.ADDRESS.name}`)
  }
  return stringValue
}

export { NeonParser }