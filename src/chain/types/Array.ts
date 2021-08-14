import ByteBuffer from 'bytebuffer';
import { ChainType, ISerializable, Type, TypeBase } from '..';

/**
 * Represents serializable data structure consisting of a collection of elements.
 *
 * @template T Type of array items.
 */
export default class ChainArray<T extends ChainType> extends Type<Array<TypeBase<T>>> implements ISerializable<Array<TypeBase<T>>> {

  //#region ~Fields~

  /**
   * The value for implementation of internal logic.
   */
  private readonly _internalValue: Array<T>;

  //#endregion

  //#region ~Constructor~

  constructor(values: Array<T>) {
    super(values.map(v => v.value() as TypeBase<T>));
    this._internalValue = values;
  }

  //#endregion

  //#region ~ISerializable~

  protected valid(): boolean {
    return true;
  }

  public bytes(): string {
    let b: Buffer = Buffer.from(this.value());
    let bb = new ByteBuffer(b.length + 4);
    bb.writeVarint32(b.length);
    bb.append(this._internalValue.reduce((result, item) => {
      return result + item.bytes();
    }, ''), 'hex');
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainArray object using its value.
   *
   * @template T Type of array items.
   *
   * @param {number} value Value to create instance of ChainArray object.
   *
   * @returns {ChainArray} New instance of ChainArray object.
   */
  static fromValue<T extends ChainType>(value: Array<T>): ChainArray<T> {
    return new ChainArray(value);
  }

  //#endregion

}
