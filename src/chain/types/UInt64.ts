import ByteBuffer from 'bytebuffer';
import { assertBytes } from '.';
import { ISerializable, Type } from '..';

/**
 * Represents serializable 64-bit unsigned integer.
 */
export default class ChainUInt64 extends Type<number> implements ISerializable<number> {

  //#region ~Constants~

  /**
   * Represents the smallest possible value of ChainUInt64.
   */
  public static readonly MinValue = 0;

  /**
   * Represents the largest possible value of ChainUInt64.
   */
  public static readonly MaxValue = 2 ** 64 - 1;

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return this.value() >= ChainUInt64.MinValue && this.value() <= ChainUInt64.MaxValue;
  }

  bytes(): string {
    let bb = new ByteBuffer(8, true);
    bb.writeUint64(this.value());
    return bb.toHex(0, 8);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainUInt64 object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainUInt64 object.
   *
   * @returns {ChainUInt64} New instance of ChainUInt64 object.
   */
  static fromBytes(bytes: string): ChainUInt64 {
    assertBytes(bytes, 8);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainUInt64.fromValue(bb.readUint64(0).toNumber());
  }

  /**
   * Creates instance of ChainUInt64 object using its value.
   *
   * @param {number} value Value to create instance of ChainUInt64 object.
   *
   * @returns {ChainUInt64} New instance of ChainUInt64 object.
   */
  static fromValue(value: number): ChainUInt64 {
    return new ChainUInt64(value);
  }

  //#endregion

}