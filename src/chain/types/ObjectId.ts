import Bigi from 'bigi';
import ByteBuffer from "bytebuffer";
import Long from "long";
import { assertBytes } from '.';
import { ISerializable, Type } from "..";

/**
 * Represents identifer of object stored in blockchain.
 */
export default class ChainObjectId extends Type<string> implements ISerializable<string> {

  //#region ~Constants~

  private static readonly LONG_MAX_INSTANCE: Long = Long.fromNumber(Math.pow(2, 48) - 1);
  private static readonly BIGI_MAX_INSTANCE: Bigi = Bigi.fromHex(Buffer.from(ChainObjectId.LONG_MAX_INSTANCE.toBytesLE()).toString('hex'));

  //#endregion

  //#region ~Fields~

  private readonly space: number;
  private readonly type: number;
  private readonly instance: Long;

  //#endregion

  //#region ~Constructor~

  constructor(value: string) {
    super(value);
    let params = value.split('.');
    this.space = parseInt(params[0]);
    this.type = parseInt(params[1]);
    this.instance = Long.fromString(params[2]);
  }

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    return /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(this.value());
  }

  bytes(): string {
    let bb = new ByteBuffer(4, true);
    bb.writeVarint32(this.instance.toNumber());
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Methods~

  /**
   * Gets 64-bit representation of blockchain identifier.
   *
   * @returns {Long} 64-bit representation of blockchain identifier.
   */
  long(): Long {
    return Long.fromNumber(this.space).shiftLeft(56).or(Long.fromNumber(this.type).shiftLeft(48).or(this.instance));
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainObjectId object using its byte representation.
   *
   * @param bytes Bytes to create instance of ChainObjectId object.
   *
   * @returns {ChainObjectId} New instance of ChainObjectId object.
   */
  static fromBytes(bytes: string): ChainObjectId {
    assertBytes(bytes, 8);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainObjectId.fromLong(bb.readUint64(0));
  }

  /**
   * Creates instance of ChainObjectId object from Long.
   *
   * @param {Long} long Long to create instance of ChainObjectId object.
   *
   * @returns {ChainObjectId} New instance of ChainObjectId object.
   */
  static fromLong(long: Long): ChainObjectId {
    let space = long.shiftRight(56).toInt();
    let type = long.shiftRight(48).toInt() & 0x00ff;
    let instance = long.and(ChainObjectId.LONG_MAX_INSTANCE);
    return new ChainObjectId(`${space}.${type}.${instance}`);
  }

  /**
   * Creates instance of ChainObjectId object from Bigi big integer.
   *
   * @param {Bigi} bigi Bigi big integer to create instance of ChainObjectId object.
   *
   * @returns {ChainObjectId} New instance of ChainObjectId object.
   */
  static fromBigi(bigi: Bigi): ChainObjectId {
    let space = bigi.shiftRight(56).intValue();
    let type = bigi.shiftRight(48).intValue() & 0x00ff;
    let instance = bigi.and(ChainObjectId.BIGI_MAX_INSTANCE);
    return new ChainObjectId(`${space}.${type}.${instance}`);
  }

  /**
   * Creates instance of ChainObjectId object using its value.
   *
   * @param {number} value Value to create instance of ChainObjectId object.
   *
   * @returns {ChainObjectId} New instance of ChainObjectId object.
   */
  static fromValue(value: string): ChainObjectId {
    return new ChainObjectId(value);
  }

  //#endregion

}