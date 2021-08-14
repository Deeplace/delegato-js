/**
 * Internal logical error of JsonRpcWebSocket.
 */
export default class InternalError implements Error {
  name: string = 'Internal error';
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}