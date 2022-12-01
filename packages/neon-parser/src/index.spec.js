const { NeonParser } = require('../dist/index')
const assert = require('assert')

describe('Neon-Parser Tests', function () {
  this.timeout(60000)

  it("converts Base64 to Hex and revert it", async () => {
    assert.equal(NeonParser.reverseHex(NeonParser.base64ToHex('ateeXCdGd+AdYKWa5w8SikaAqlk=')), '59aa80468a120fe79aa5601de07746275c9ed76a')
    return true
  })

  it("converts address to script hash", async () => {
    assert.equal(NeonParser.accountInputToScripthash('NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr'), '857a247939db5c7cd3a7bb14791280c09e824bea')
    return true
  })

})
