export interface Neo3Parser {
  /**
   * Converts a string to base64
   * @param input The string to convert
   */
  stringToBase64: (input: string) => string
  /**
   * Formats the response from the RPC server to an easier to use format for dapp developers
   * @param input The response from the RPC server
   */
  formatResponse: (field: any) => any
}
