import { JsonType } from "..";

/**
 * The error occurres after method call processing on server side.
 */
export default class MethodError implements Error {
  name: string = 'Method error';
  message: string;

  /**
   * Payload of server error message.
   */
  data: JsonType;

  /**
   * @param data Payload of server error message.
   */
  constructor(data: JsonType) {
    this.message = 'An error occured on method call.';
    this.data = data;
  }
}