import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Type } from "..";

/**
 * Represents serializable 16-bit unsigned integer.
 */
export default class ChainUInt16 extends Type<number> implements ISerializable<number> {

  //#region ~Constants~

  /**
   * Represents the smallest possible value of ChainUInt16.
   */
  public static readonly MinValue: number = 0;

  /**
   * Represents the largest possible value of ChainUInt16.
   */
  public static readonly MaxValue: number = 2 ** 16 - 1;

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return this.value() >= ChainUInt16.MinValue && this.value() <= ChainUInt16.MaxValue;
  }

  bytes(): string {
    let bb = new ByteBuffer(2, true);
    bb.writeUint16(this.value(), 0);
    return bb.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainUInt16 object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainUInt16 object.
   *
   * @returns {ChainUInt16} New instance of ChainUInt16 object.
   */
  static fromBytes(bytes: string): ChainUInt16 {
    assertBytes(bytes, 2);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainUInt16.fromValue(bb.readUint16(0));
  }

  /**
   * Creates instance of ChainUInt16 object using its value.
   *
   * @param {number} value Value to create instance of ChainUInt16 object.
   *
   * @returns {ChainUInt16} New instance of ChainUInt16 object.
   */
  static fromValue(value: number): ChainUInt16 {
    return new ChainUInt16(value);
  }

  //#endregion

}