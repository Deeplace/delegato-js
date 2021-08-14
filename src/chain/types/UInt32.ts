import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Type } from "..";

/**
 * Represents serializable 32-bit unsigned integer.
 */
export default class ChainUInt32 extends Type<number> implements ISerializable<number> {

  //#region ~Constants~

  /**
   * Represents the smallest possible value of ChainUInt32.
   */
  public static readonly MinValue: number = 0;

  /**
   * Represents the largest possible value of ChainUInt32.
   */
  public static readonly MaxValue: number = 2 ** 32 - 1;

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return this.value() >= ChainUInt32.MinValue && this.value() <= ChainUInt32.MaxValue;
  }

  bytes(): string {
    let bb = new ByteBuffer(4, true);
    bb.writeUint32(this.value(), 0);
    return bb.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainUInt32 object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainUInt32 object.
   *
   * @returns {ChainUInt32} New instance of ChainUInt32 object.
   */
  static fromBytes(bytes: string): ChainUInt32 {
    assertBytes(bytes, 4);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainUInt32.fromValue(bb.readUint32(0));
  }

  /**
   * Creates instance of ChainUInt32 object using its value.
   *
   * @param {number} value Value to create instance of ChainUInt32 object.
   *
   * @returns {ChainUInt32} New instance of ChainUInt32 object.
   */
  static fromValue(value: number): ChainUInt32 {
    return new ChainUInt32(value);
  }

  //#endregion

}