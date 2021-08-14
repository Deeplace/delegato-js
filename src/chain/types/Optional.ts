import ByteBuffer from 'bytebuffer';
import { assertBytes, ChainType } from '.';
import { ISerializable, Type } from '..';
import ChainUInt16 from './UInt16';

type SubType<T> = T extends ISerializable<infer U> ? U : never;

type b = SubType<ChainUInt16>;

/**
 * Represents serializable 64-bit signed integer.
 */
export default class Optional<T extends ISerializable<any>> implements ISerializable<SubType<T> | null> {
  private readonly _value: T | null;

  constructor(value: T | null) {
    this._value = value;
  }

  //#region ~ISerializable~

  valid(): boolean {
    return false;
  }

  value(): SubType<T> | null {
    if (this._value == null) {
      return null;
    }
    return this._value.value();
  }

  bytes(): string {
    let bb: ByteBuffer;
    const value = this._value;
    if (value === null) {
      bb = new ByteBuffer(1, true);
      bb.writeByte(0);
      return bb.toHex(0, 1);
    }
    const bytes = value.bytes();
    const length = bytes.length / 2 + 1;
    bb = new ByteBuffer(length, true);
    bb.writeByte(1);
    bb.append(bytes, 'hex');
    return bb.toHex(0, length);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainInt64 object using its value.
   *
   * @param {number} value Value to create instance of ChainInt64 object.
   *
   * @returns {ChainInt64} New instance of ChainInt64 object.
   */
  static fromValue<T extends ChainType>(value: T | null): Optional<T> {
    return new Optional<T>(value);
  }

  //#endregion

}
