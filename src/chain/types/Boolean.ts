import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Type } from "..";

/**
 * Represents serializable 8-bit unsigned integer.
 */
export default class ChainBoolean extends Type<boolean> implements ISerializable<boolean> {

  //#region ~ISerializable~

  valid(): boolean {
    return true;
  }

  bytes(): string {
    let bb = new ByteBuffer(1, true);
    bb.writeUint8(this.value() ? 1 : 0, 0);
    return bb.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainBoolean object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainBoolean object.
   *
   * @returns {ChainBoolean} New instance of ChainBoolean object.
   */
  static fromBytes(bytes: string): ChainBoolean {
    assertBytes(bytes, 1);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainBoolean.fromValue(bb.readUint8(0) == 0 ? false : true);
  }

  /**
   * Creates instance of ChainBoolean object using its value.
   *
   * @param {boolean} value Value to create instance of ChainBoolean object.
   *
   * @returns {ChainBoolean} New instance of ChainBoolean object.
   */
  static fromValue(value: boolean): ChainBoolean {
    return new ChainBoolean(value);
  }

  //#endregion

}