/**
 * Occures when blockchain type validation fails.
 */
export default class ValidationError implements Error {
  readonly name: string = 'Validation error';
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}