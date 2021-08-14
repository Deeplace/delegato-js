import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Type } from "..";

/**
 * Represents datetime structure which can be stored in blockchain.
 */
export default class ChainTime extends Type<string> implements ISerializable<string> {

  //#region ~Fields~

  /**
   * The value for implementation of internal logic.
   */
  private time!: number;

  static _min?: ChainTime;

  static _max?: ChainTime;

  //#endregion

  //#region ~Constructor~

  constructor(value: Date | string) {
    super(value instanceof Date ? value.toISOString().replace(/(\.[0-9][0-9][0-9])?Z?$/, '') : value.replace(/(\.[0-9][0-9][0-9])?Z?$/, ''));
  }

  //#endregion

  //#region ~ISerializable~

  valid(): boolean {
    if (/^[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9][0-9][0-9])?Z?$/.test(this.value())) {
      this.time = Math.floor(new Date(`${this.value()}Z`).getTime() / 1000);
      return true;
    }
    return false;
  }

  bytes(): string {
    let bb = new ByteBuffer(4, true);
    bb.writeUint32(this.time, 0);
    return bb.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainTime object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainTime object.
   *
   * @returns {ChainTime} New instance of ChainTime object.
   */
  static fromBytes(bytes: string): ChainTime {
    assertBytes(bytes, 4);
    let bb = ByteBuffer.fromHex(bytes, true);
    return ChainTime.fromDate(new Date(bb.readUint32(0) * 1000));
  }

  /**
   * Creates instance of ChainTime object using Date structure.
   *
   * @param {Date} value Date to create instance of ChainTime object.
   *
   * @returns {ChainTime} New instance of ChainTime object.
   */
  static fromDate(value: Date): ChainTime {
    return new ChainTime(value);
  }

  /**
   * Creates instance of ChainTime object using its value.
   *
   * @param {string} value Value to create instance of ChainTime object.
   *
   * @returns {ChainTime} New instance of ChainTime object.
   */
  static fromValue(value: string): ChainTime {
    return new ChainTime(value);
  }

  /**
   * Minimum time which can be represented by ChainTime object.
   */
  static get min(): ChainTime {
    if (ChainTime._min === undefined) {
      ChainTime._min = ChainTime.fromBytes('00000000');
    }
    return ChainTime._min;
  }

  /**
   * Maximum time which can be represented by ChainTime object.
   */
  static get max(): ChainTime {
    if (ChainTime._max === undefined) {
      ChainTime._max = ChainTime.fromBytes('ffffffff');
    }
    return ChainTime._max;
  }

  //#endregion

}