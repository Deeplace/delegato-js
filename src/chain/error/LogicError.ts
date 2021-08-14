/**
 * Occures when on logical error.
 */
export default class LogicError implements Error {
  readonly name: string = 'Logic error';
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}