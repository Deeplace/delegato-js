import ByteBuffer from 'bytebuffer';
import { assertBytes } from '.';
import { ISerializable, Type } from '..';

/**
 * Represents serializable 64-bit signed integer.
 */
export default class ChainInt64 extends Type<number> implements ISerializable<number> {

  //#region ~Constants~

  /**
   * Represents the smallest possible value of ChainInt64.
   */
  public static readonly MinValue = -(2 ** 63);

  /**
   * Represents the largest possible value of ChainInt64.
   */
  public static readonly MaxValue = 2 ** 63 - 1;

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return this.value() >= ChainInt64.MinValue && this.value() <= ChainInt64.MaxValue;
  }

  bytes(): string {
    let bb = new ByteBuffer(8, true);
    bb.writeInt64(this.value());
    return bb.toHex(0, 8);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainInt64 object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainInt64 object.
   *
   * @returns {ChainInt64} New instance of ChainInt64 object.
   */
  static fromBytes(bytes: string): ChainInt64 {
    assertBytes(bytes, 8);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainInt64.fromValue(bb.readInt64(0).toNumber());
  }

  /**
   * Creates instance of ChainInt64 object using its value.
   *
   * @param {number} value Value to create instance of ChainInt64 object.
   *
   * @returns {ChainInt64} New instance of ChainInt64 object.
   */
  static fromValue(value: number): ChainInt64 {
    return new ChainInt64(value);
  }

  //#endregion

}