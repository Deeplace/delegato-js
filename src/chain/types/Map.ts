import ByteBuffer from 'bytebuffer';
import { ChainString } from '.';
import { ChainType, Dictionary, ISerializable, Type, TypeBase } from '..';

/**
 * Represents serializable abstract data type composed of a collection of (key, value) pairs, such that each possible key appears at most once in the collection.
 *
 * @template K Type of map keys.
 * @template V Type of map items.
 */
export default class ChainMap<K extends ChainType, V extends ChainType> extends Type<[TypeBase<K>, TypeBase<V>][]> implements ISerializable<[TypeBase<K>, TypeBase<V>][]> {

  //#region ~Fields~

  /**
   * The value for implementation of internal logic.
   */
  private readonly _internalValue: Map<K, V>;

  //#endregion

  //#region ~Constructor~

  constructor(values: Map<K, V>) {
    // super(new Map(Array.from(values.entries()).map(e => {
    //   return [e[0].value(), e[1].value()] as [TypeBase<K>, TypeBase<V>];
    // })));
    super(Array.from(values.entries()).map(e => {
      return [e[0].value(), e[1].value()] as [TypeBase<K>, TypeBase<V>];
    }));
    this._internalValue = values;
  }

  //#endregion

  //#region ~ISerializable~

  protected valid(): boolean {
    return true;
  }

  public bytes(): string {
    let bb = new ByteBuffer();
    let entries = Array.from(this._internalValue.entries());
    bb.writeVarint32(entries.length);
    bb.append(entries.reduce((result, e) => {
      return result + e[0].bytes() + e[1].bytes();
    }, ''), 'hex');
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainMap object using its value.
   *
   * @template T Type of array items.
   *
   * @param {number} value Value to create instance of ChainMap object.
   *
   * @returns {ChainMap} New instance of ChainMap object.
   */
  static fromValue<K extends ChainType, V extends ChainType>(value: Map<K, V>): ChainMap<K, V> {
    return new ChainMap(value);
  }

  //#endregion

}
