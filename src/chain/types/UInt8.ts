import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Type } from "..";

/**
 * Represents serializable 8-bit unsigned integer.
 */
export default class ChainUInt8 extends Type<number> implements ISerializable<number> {

  //#region ~Constants~

  /**
   * Represents the smallest possible value of ChainUInt8.
   */
  public static readonly MinValue: number = 0;

  /**
   * Represents the largest possible value of ChainUInt8.
   */
  public static readonly MaxValue: number = 2 ** 8 - 1;

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return this.value() >= ChainUInt8.MinValue && this.value() <= ChainUInt8.MaxValue;
  }

  bytes(): string {
    let bb = new ByteBuffer(1, true);
    bb.writeUint8(this.value(), 0);
    return bb.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainUInt8 object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainUInt8 object.
   *
   * @returns {ChainUInt8} New instance of ChainUInt8 object.
   */
  static fromBytes(bytes: string): ChainUInt8 {
    assertBytes(bytes, 1);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainUInt8.fromValue(bb.readUint8(0));
  }

  /**
   * Creates instance of ChainUInt8 object using its value.
   *
   * @param {number} value Value to create instance of ChainUInt8 object.
   *
   * @returns {ChainUInt8} New instance of ChainUInt8 object.
   */
  static fromValue(value: number): ChainUInt8 {
    return new ChainUInt8(value);
  }

  //#endregion

}