<p align="center">
  <img
    src=".github/resources/images/coz.png"
    width="200px;">
</p>

<p align="center">
  Neo3-parser - A declarative SmartContract Parsing Spec.
  <br/> Made with ❤ by <b>COZ.IO</b>
</p>

# Neo3-parser

Neo3-parser is a specification of how SmartContract client SDKs can interact with different parsing libraries such as Neon-JS.

Visit the [main page](../../README.md) of the project.

## How to parse responses

After invoking a contract you'll get the results on a stack. Use the `parseRpcResponse(field: RpcResponse, parseConfig?: ParseConfig)` function on each item to get the results parsed.

### How to use parseConfig

The `parseConfig` object has the following properties:

| Property                  | Description                                                                               |
|---------------------------|-------------------------------------------------------------------------------------------|
| type: string              | a [valid ABI Type](https://github.com/neo-project/proposals/blob/master/nep-14.mediawiki#method)|
| hint?: string             | a type that extends from the ABI type                                                     |
| generic?: ParseConfig     | you only need to pass this prop if `type` is `"Array"`                                    |
| genericKey?: ParseConfig  | you only need to pass this prop if `type` is `"Map"`                                      |
| genericItem?: ParseConfig | you only need to pass this prop if `type` is `"Map"`                                      |
| union?: ParseConfig[]     | you only need to pass this prop if `type` is `"Any"` and you expect to get multiple types |

> Note: check [HINT_TYPES](./src/index.ts) to see what types are available to use on `hint`.

### Example

```ts
// Simulating a result stack after invoking a contract
const stackResult = [ 
  {
    type: "ByteString",
    value: "AAECAwQFBgcICQoLDA0ODxAREhM=" // This value is a Hash160
  } 
]

// Call parseRpcResponse on an item of the stack
const response = Neo3Parser.parseRpcResponde(stackResult[0])

console.log(response) 
// Expected output: "☺☻♥♦♣♠\n♫☼►◄↕‼"

// You can use the `parseConfig` parameter to change how to parse the response
const responseHash160 = Neo3Parser.parseRpcResponde(stackResult[0], { type: "Hash160"})

console.log(responseHash160)
// Expected output: "0x131211100f0e0d0c0b0a09080706050403020100"

// Adding a hint might also change how it is parsed
const responseHash160LE = Neo3Parser.parseRpcResponde(stackResult[0], { type: "Hash160", hint: "ScriptHashLittleEndian"})

console.log(responseHash160LE)
// Expected output: "000102030405060708090a0b0c0d0e0f10111213"
```

#### Using neo3-boa to get the parseConfig

If you compiled your smart contract with Neo3-boa you can use the ABI inside the `.manifest.json` file as the `parseConfig`.

For example, compiling [this smart contract](https://github.com/CityOfZion/neo3-boa/blob/d43c0a3cdb1db11e80093d8da8b30441384ba213/boa3_test/test_sc/generation_test/ManifestTypeHintFromUInt160ToScriptHashLittleEndian.py) will generate the following file:

```json
{
    "name": "ManifestTypeHintFromUInt160ToScriptHashLittleEndian",
    "groups": [],
    "abi": {
        "methods": [
            {
                "name": "Main",
                "offset": 0,
                "parameters": [],
                "safe": false,
                "returntype": "Hash160",
                "returnhint": "ScriptHashLittleEndian"
            }
        ],
        "events": []
    },
    "permissions": [
        {
            "contract": "*",
            "methods": "*"
        }
    ],
    "trusts": [],
    "features": {},
    "supportedstandards": [],
    "extra": null
}
```

Then, you can copy the properties of the method you want to parse that have the `return` prefix, in this example it should be `returntype` and `returnhint`.
Remove the `return` prefix and attribute it to a `ParseConfig` variable in your TypeScript file.

```ts
const parseConfigFromNeo3boa = {
  "type": "Hash160",
  "hint": "ScriptHashLittleEndian"
}

const responseHash160LE = Neo3Parser.parseRpcResponde(stackResult[0], parseConfigFromNeo3boa)

console.log(responseHash160LE)
// Expected output: "000102030405060708090a0b0c0d0e0f10111213"
```
