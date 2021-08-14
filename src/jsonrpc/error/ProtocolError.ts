/**
 * Occurres if not described by JSON-RPC 2.0 protocol action appears.
 */
export default class ProtocolError implements Error {
  name: string = 'Protocol error';
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}