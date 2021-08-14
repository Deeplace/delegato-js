/**
 * Occurres on web socket connection error.
 */
export default class ConnectionError implements Error {
  name: string = 'Connection error';
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}