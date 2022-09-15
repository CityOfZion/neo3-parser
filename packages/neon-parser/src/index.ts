import { Neo3Parser } from '@cityofzion/neo3-parser'
import { u } from '@cityofzion/neon-js'

export const NeonParser: Neo3Parser = {
  stringToBase64: (input: string): string => {
    return u.hex2base64(u.str2hexstring(input))
  },
  formatResponse(field: any): any {
    switch (field.type) {
      case "ByteString":
        const rawValue = u.base642hex(field.value)
        if (rawValue.length === 40) {
          return `0x${u.reverseHex(rawValue)}`
        }
        return u.hexstring2str(rawValue)
      case "Integer":
        return parseInt(field.value)
      case "Array":
        return field.value.map( (f: any) => {
          return NeonParser.formatResponse(f)
        })
      case "Map":
        const object: {
          [key: string]: any
        } = {}
        field.value.forEach( (f: any) => {
          let key: string = NeonParser.formatResponse(f.key)
          object[key] = NeonParser.formatResponse(f.value)
        })
        return object
      default:
        return field.value
    }
  }
}
