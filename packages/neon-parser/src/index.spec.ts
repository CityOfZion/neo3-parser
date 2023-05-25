import { NeonParser } from "."
import {describe, it} from "mocha"
import * as assert from "assert";


describe("Neon-Parser Tests", function () {
  this.timeout(60000)

  it("converts Base64 to Hex and revert it", async () => {
    assert.equal(NeonParser.reverseHex(NeonParser.base64ToHex("ateeXCdGd+AdYKWa5w8SikaAqlk=")), "59aa80468a120fe79aa5601de07746275c9ed76a")
  })

  it("converts address to script hash", async () => {
    assert.equal(NeonParser.accountInputToScripthash("NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr"), "857a247939db5c7cd3a7bb14791280c09e824bea")
  })

})

describe("RPC Parser Tests", function () {

  it("Parse Address", async () => {
    const rpcResponse = {
      type: "ByteString",
      value: NeonParser.asciiToBase64("NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs")
    }

    const address = NeonParser.parseRpcResponse(rpcResponse, {type: "String", hint: "Address"})
    assert.deepEqual(address, "NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs") 
  })

  it("Parse invalid Address", async () => {
    const rpcResponse = {
      type: "ByteString",
      // Address will end up too short
      value: NeonParser.hexToBase64("Nnnnnnnnnnnnnnnn")
    }
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "String", hint: "Address"}))
    
    // Address will be too big
    rpcResponse.value = NeonParser.strToBase64("NnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnn")
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "String", hint: "Address"}))
    
    // Address shouldn't start with a letter that isn't 'A' or 'N'
    rpcResponse.value = NeonParser.strToBase64("BNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs")
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "String", hint: "Address"}))
    
    // Address shouldn't have invalid base58 characters
    rpcResponse.value = NeonParser.strToBase64("NNLI44dJNXtDNSBkofB48aTVYtb1zZrNEL")
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "String", hint: "Address"}))
  })

  it("Parse ScriptHash and ScriptHashLittleEndian", async () => {
    const rpcResponse = {
      type: "ByteString",
      value: NeonParser.hexToBase64("61479ab68fd5c2c04b254f382d84ddf2f5c67ced")
    }

    const scriptHash = NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHash"})
    assert.deepEqual(scriptHash, "0xed7cc6f5f2dd842d384f254bc0c2d58fb69a4761") 

    const scriptHashLilEndian = NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHashLittleEndian"})
    assert.deepEqual(scriptHashLilEndian, "61479ab68fd5c2c04b254f382d84ddf2f5c67ced") 
  })

  it("Parse invalid ScriptHash and ScriptHashLittleEndian", async () => {
    const rpcResponse = {
      type: "ByteString",
      // ScriptHash will end up too short
      value: NeonParser.hexToBase64("61479ab68fd5c2c04b25")
    }
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHash"}))
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHashLittleEndian"}))
    
    // ScriptHash will be too big
    rpcResponse.value = NeonParser.hexToBase64("61479ab68fd5c2c04b254f382d84ddf2f5c67ced111111111111")
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHash"}))
    assert.throws(() => NeonParser.parseRpcResponse(rpcResponse, {type: "Hash160", hint: "ScriptHashLittleEndian"}))
  })

  it("Parse BlockHash or TransactionId", async () => {
    const rpcResponse = {
      type: "ByteString",
      value: NeonParser.hexToBase64(
        NeonParser.reverseHex("0x6c513de791b17ddadec205a07301229ac890d71c16c1d5a0320c655fb69214fc".substring(2))
      )
    }

    const blockHash = NeonParser.parseRpcResponse(rpcResponse, {type: "Hash256", hint: "BlockHash"})
    const transactionId = NeonParser.parseRpcResponse(rpcResponse, {type: "Hash256", hint: "TransactionId"})
    assert.deepEqual(transactionId, "0x6c513de791b17ddadec205a07301229ac890d71c16c1d5a0320c655fb69214fc") 
    assert.deepEqual(blockHash, transactionId) 
 
    // There isn't a different on how they are returned right now
    const hash256 = NeonParser.parseRpcResponse(rpcResponse, {type: "Hash256"})
    assert.deepEqual(hash256, blockHash)
  })

  it("Parse ByteString without parseConfig", async () => {
    const rpcResponse = {
      type: "ByteString",
      value: NeonParser.asciiToBase64("Testing")
    }

    const stringValue = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(stringValue, "Testing") 

    const bytesValue = NeonParser.parseRpcResponse(rpcResponse, {type: 'ByteArray'})
    assert.deepEqual(bytesValue, "54657374696e67") 
  })


  it("Parse Integer", async () => {
    const rpcResponse = {
      type: "Integer",
      value: "18"
    }

    const integer = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(integer, 18) 
  })

  it("Parse single type Array", async () => {
    let rpcResponse = {
      type: "Array",
      value: [
        {
          type: "Integer",
          value: "10"
        },
        {
          type: "Integer",
          value: "20"
        },
        {
          type: "Integer",
          value: "30"
        },
      ]
    }
    let array = NeonParser.parseRpcResponse(rpcResponse, {type: "Array", generic: { type: "Integer"} })
    assert.deepEqual(array, [10, 20, 30]) 

    rpcResponse = {
      type: "Array",
      value: [
        {
          type: "ByteString",
          value: NeonParser.strToBase64("test")
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("array")
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("return")
        },
      ]
    }
    array = NeonParser.parseRpcResponse(rpcResponse, {type: "Array", generic: { type: "String"} })
    assert.deepEqual(array, ["test", "array", "return"]) 
  
    // Will also work if you don't send a parseConfig and expects the ByteString results to be a String
    assert.deepEqual(array, NeonParser.parseRpcResponse(rpcResponse))  

    rpcResponse = {
      type: "Array",
      value: [
        {
          type: "ByteString",
          value: NeonParser.strToBase64("test")
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("array")
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("return")
        },
      ]
    }
    array = NeonParser.parseRpcResponse(rpcResponse, {type: "Array", generic: { type: "ByteArray"} })
    assert.deepEqual(array, ["74657374", "6172726179", "72657475726e"]) 
  })

  it("Parse Union", async () => {
    let rpcResponse = {
      type: "ByteString",
      value: NeonParser.strToBase64("test")
    }
    let union = NeonParser.parseRpcResponse(rpcResponse, {type: "Any", union: [{ type: "String"}, {type: "Integer"}]})
    assert.deepEqual(union, "test") 

    rpcResponse = {
      type: "Integer",
      value: "12"
    }
    union = NeonParser.parseRpcResponse(rpcResponse, {type: "Any", union: [{ type: "String"}, {type: "Integer"}]})
    assert.deepEqual(union, 12) 

    rpcResponse = {
      type: "ByteString",
      value: NeonParser.hexToBase64("61479ab68fd5c2c04b254f382d84ddf2f5c67ced")
    }
    union = NeonParser.parseRpcResponse(rpcResponse, {type: "Any", union: [{ type: "Hash160", hint: "ScriptHash"}, {type: "Integer"}]})
    assert.deepEqual(union, "0xed7cc6f5f2dd842d384f254bc0c2d58fb69a4761") 
  })

  it("Try parse same internal types with Union", async () => {
    let rpcResponse = {
      type: "ByteString",
      value: NeonParser.strToBase64("test")
    }

    // It's not possible to definitly know the correct return of the same internal type, currently, it's only a ByteString problem, 
    // so whenever there are multiple ByteStrings on a union it will be considerer as a String 
    const str = NeonParser.parseRpcResponse(rpcResponse, {type: "Any", union: [{ type: "Hash160", hint: "ScriptHash" }, { type: "Hash256", hint: "BlockHash"}, {type: "Integer"}]})
    assert.deepEqual(str, "test") 
  })

  it("Parse multiple types Array", async () => {
    let rpcResponse = {
      type: "Array",
      value: [
        {
          type: "Integer",
          value: "10"
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("test")
        },
        {
          type: "ByteString",
          value: NeonParser.strToBase64("parser")
        },
      ]
    }
    let array = NeonParser.parseRpcResponse(rpcResponse, 
      {
        type: "Array", 
        generic: { 
          type: "Any", 
          union: [
            {
              type: "Integer"
            }, 
            { 
              type: "String"}
            ]
          } 
        }
      )
    assert.deepEqual(array, [10, "test", "parser"])

    rpcResponse = {
      type: "Array",
      value: [
        {
          type: "Integer",
          value: "10"
        },
        {
          type: "ByteString",
          value: "Tk5MaTQ0ZEpOWHRETlNCa29mQjQ4YVRWWXRiMXpack5Fcw"
        },
        {
          type: "ByteString",
          value: "TlozcHFuYzFoTU44RUhXNTVabkNudThCMndvb1hKSEN5cg=="
        },
      ]
    }
    array = NeonParser.parseRpcResponse(rpcResponse, 
      {
        type: "Array", 
        generic: { 
          type: "Any", 
          union: [
            {
              type: "Integer"
            }, 
            { 
              type: "String",
              hint: "Address"
            }
          ]
        } 
      }
    )
    assert.deepEqual(array, [10, "NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs", "NZ3pqnc1hMN8EHW55ZnCnu8B2wooXJHCyr"])
  })

  it("Parse single type Map", async () => {
    let rpcResponse = {
      type: "Map",
      value: [
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("unit")
          },
          value: {
            type: "ByteString",
            value: NeonParser.strToBase64("test")
          }
        },
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("neo")
          },
          value: {
            type: "ByteString",
            value: NeonParser.strToBase64("parser")
          }
        },
      ]
    }
    let map = NeonParser.parseRpcResponse(rpcResponse, 
      {
        type: "Map",
        genericKey: { type: "String" }, genericItem: { type: "String" } 
      }
    )
    assert.deepEqual(map, { unit: "test", neo: "parser" })
    // Will also work if you don't send a parseConfig and expects the ByteString results to be a String
    assert.deepEqual(map, NeonParser.parseRpcResponse(rpcResponse))
  })

  it("Parse multiple types Map", async () => {
    let rpcResponse = {
      type: "Map",
      value: [
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("unit")
          },
          value: {
            type: "ByteString",
            value: NeonParser.strToBase64("test")
          }
        },
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("neo")
          },
          value: {
            type: "Integer", 
            value: "123"
          } 
        },
        {
          key: {
            type: "Integer",
            value: "789"
          },
          value: {
            type: "Integer", 
            value: "123"
          } 
        },
      ]
    }
    let map = NeonParser.parseRpcResponse(rpcResponse, 
      {
        type: "Map",
        genericKey: { type: "Any", union:[ { type: "String" }, { type: "Integer" } ] }, 
        genericItem: { type: "Any", union:[ { type: "String" }, { type: "Integer" } ] } 
      }
    )
    assert.deepEqual(map, { unit: "test", neo: 123 , 789: 123 })
  })

  it("Parse Boolean", async () => {
    let rpcResponse = {
      "type": "Boolean",
      "value": true
    }

    let bool = NeonParser.parseRpcResponse(rpcResponse, { type: "Boolean"})
    assert.deepEqual(bool, true)
    bool = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(bool, true)

    rpcResponse.value = false
    bool = NeonParser.parseRpcResponse(rpcResponse, { type: "Boolean"})
    assert.deepEqual(bool, false)
    bool = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(bool, false)
  })

  it("Parse Iterator", async () => {
    let rpcResponse = {
      "type": "InteropInterface",
      "interface": "IIterator",
      "id": "e93e82f7-629b-4b4b-9fae-054d18bd32e2"
    }

    // currently can't parse an iterator
    const iterator = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(iterator, undefined)
  })

  it("Parse Array inside Map", async () => {
    const rpcResponse = {
      type: "Map",
      value: [
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("test")
          },
          value: {
            type: "Array",
            value: [
              { type: "ByteString", value: NeonParser.strToBase64("abc") },
              { type: "ByteString", value: NeonParser.strToBase64("def") },
              { type: "ByteString", value: NeonParser.strToBase64("ghi") },
            ]
          }
        },
        {
          key: {
            type: "ByteString",
            value: NeonParser.strToBase64("neo")
          },
          value: {
            type: "Integer", 
            value: "123"
          } 
        },
      ]
    }

    const map = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(map, {test: ['abc', 'def', 'ghi'], neo: 123})

    const mapWithConfig = NeonParser.parseRpcResponse(rpcResponse, 
      {
        type: 'Map', 
        genericKey: { type: 'String' }, 
        genericItem: { type: 'Any', union: [ {type: 'Integer'}, { type: 'Array', generic: {type: 'ByteArray'} }]}
      }
    )
    assert.deepEqual(mapWithConfig, {test: ['616263', '646566', '676869'], neo: 123})
  })

  it("Parse Map inside Array", async () => {
    const rpcResponseArray = {
      type: "Array",
      value: [
        { type: "ByteString", value: NeonParser.strToBase64("abc") },
        { type: "Map", value: [
          { 
            key: { type: 'ByteString', value: NeonParser.strToBase64("neon") }, 
            value: { type: 'ByteString', value: NeonParser.strToBase64("parser") }, 
          },
          { 
            key: { type: 'ByteString', value: NeonParser.strToBase64("unit") }, 
            value: { type: 'ByteString', value: NeonParser.strToBase64("test") }, 
          },
        ] },
        { type: "ByteString", value: NeonParser.strToBase64("def") },
      ]
    }
    let array = NeonParser.parseRpcResponse(rpcResponseArray)
    assert.deepEqual(array, ['abc', { neon: 'parser', unit: 'test' }, 'def'])

    array = NeonParser.parseRpcResponse(rpcResponseArray, {
      type: 'Array', 
      generic: {type: 'Any', union: [ {type: 'String'}, {type: 'Map', genericKey: {type: 'String'}, genericItem: {type: 'ByteArray'}} ]}
    })
    assert.deepEqual(array, ['abc', { neon: '706172736572', unit: '74657374' }, 'def'])
  })

  it("Parse raw when UTF8 parsing fails", async () => {
    const rpcResponse = {
      "type": "Map",
      "value": [
        {
          "key": {
            "type": "ByteString",
            "value": "bmFtZQ=="
          },
          "value": {
            "type": "ByteString",
            "value": "TElaQVJE"
          }
        }, {
          "key": {
            "type": "ByteString",
            "value": "c2VlZA=="
          },
          "value": {
            "type": "ByteString",
            "value": "dphNnS0kGxelyR4Q8ntrbA=="
          }
        }
      ]
    }

    const parsed = NeonParser.parseRpcResponse(rpcResponse)
    assert.deepEqual(parsed, { name: 'LIZARD', seed: 'dphNnS0kGxelyR4Q8ntrbA==' })

  })
})
