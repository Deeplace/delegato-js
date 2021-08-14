import ByteBuffer from 'bytebuffer';
import { assertBytes } from '.';
import { ISerializable, Type } from "..";

/**
 * Represents a string which can be stored in blockhain.
 */
export default class ChainString extends Type<string> implements ISerializable<string> {

  //#region ~ISerializable~

  protected valid(): boolean {
    return true;
  }

  public bytes(): string {
    let b = Buffer.from(this.value());
    let bb = new ByteBuffer(b.length + 4, true);
    bb.writeVarint32(b.length);
    bb.writeString(this.value());
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainString object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainString object.
   *
   * @returns {ChainString} New instance of ChainString object.
   */
  static fromBytes(bytes: string): ChainString {
    assertBytes(bytes);
    let bb = ByteBuffer.fromHex(bytes, true);
    let length = bb.readVarint32();
    return ChainString.fromValue(bb.readUTF8String(length, ByteBuffer.METRICS_BYTES));
  }

  /**
   * Creates instance of ChainString object using its value.
   *
   * @param {string} value Value to create instance of ChainString object.
   *
   * @returns {ChainString} New instance of ChainString object.
   */
  static fromValue(value: string): ChainString {
    return new ChainString(value);
  }

  //#endregion

}
