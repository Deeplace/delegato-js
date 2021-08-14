import ByteBuffer from "bytebuffer";
import { assertBytes } from ".";
import { ISerializable, Tuple, Type, ValidationError } from "..";

/**
 * Represents a bytes written in hexadecimal notation.
 */
type Byte = '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '0a' | '0A' | '0b' | '0B' | '0c' | '0C' | '0d' | '0D' | '0e' | '0E' | '0f' | '0F' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '1a' | '1A' | '1b' | '1B' | '1c' | '1C' | '1d' | '1D' | '1e' | '1E' | '1f' | '1F' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '2a' | '2A' | '2b' | '2B' | '2c' | '2C' | '2d' | '2D' | '2e' | '2E' | '2f' | '2F' | '30' | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '3a' | '3A' | '3b' | '3B' | '3c' | '3C' | '3d' | '3D' | '3e' | '3E' | '3f' | '3F' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48' | '49' | '4a' | '4A' | '4b' | '4B' | '4c' | '4C' | '4d' | '4D' | '4e' | '4E' | '4f' | '4F' | '50' | '51' | '52' | '53' | '54' | '55' | '56' | '57' | '58' | '59' | '5a' | '5A' | '5b' | '5B' | '5c' | '5C' | '5d' | '5D' | '5e' | '5E' | '5f' | '5F' | '60' | '61' | '62' | '63' | '64' | '65' | '66' | '67' | '68' | '69' | '6a' | '6A' | '6b' | '6B' | '6c' | '6C' | '6d' | '6D' | '6e' | '6E' | '6f' | '6F' | '70' | '71' | '72' | '73' | '74' | '75' | '76' | '77' | '78' | '79' | '7a' | '7A' | '7b' | '7B' | '7c' | '7C' | '7d' | '7D' | '7e' | '7E' | '7f' | '7F' | '80' | '81' | '82' | '83' | '84' | '85' | '86' | '87' | '88' | '89' | '8a' | '8A' | '8b' | '8B' | '8c' | '8C' | '8d' | '8D' | '8e' | '8E' | '8f' | '8F' | '90' | '91' | '92' | '93' | '94' | '95' | '96' | '97' | '98' | '99' | '9a' | '9A' | '9b' | '9B' | '9c' | '9C' | '9d' | '9D' | '9e' | '9E' | '9f' | '9F' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'aa' | 'aA' | 'ab' | 'aB' | 'ac' | 'aC' | 'ad' | 'aD' | 'ae' | 'aE' | 'af' | 'aF' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'Aa' | 'AA' | 'Ab' | 'AB' | 'Ac' | 'AC' | 'Ad' | 'AD' | 'Ae' | 'AE' | 'Af' | 'AF' | 'b0' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' | 'b9' | 'ba' | 'bA' | 'bb' | 'bB' | 'bc' | 'bC' | 'bd' | 'bD' | 'be' | 'bE' | 'bf' | 'bF' | 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'Ba' | 'BA' | 'Bb' | 'BB' | 'Bc' | 'BC' | 'Bd' | 'BD' | 'Be' | 'BE' | 'Bf' | 'BF' | 'c0' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'ca' | 'cA' | 'cb' | 'cB' | 'cc' | 'cC' | 'cd' | 'cD' | 'ce' | 'cE' | 'cf' | 'cF' | 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'Ca' | 'CA' | 'Cb' | 'CB' | 'Cc' | 'CC' | 'Cd' | 'CD' | 'Ce' | 'CE' | 'Cf' | 'CF' | 'd0' | 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' | 'd9' | 'da' | 'dA' | 'db' | 'dB' | 'dc' | 'dC' | 'dd' | 'dD' | 'de' | 'dE' | 'df' | 'dF' | 'D0' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'Da' | 'DA' | 'Db' | 'DB' | 'Dc' | 'DC' | 'Dd' | 'DD' | 'De' | 'DE' | 'Df' | 'DF' | 'e0' | 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8' | 'e9' | 'ea' | 'eA' | 'eb' | 'eB' | 'ec' | 'eC' | 'ed' | 'eD' | 'ee' | 'eE' | 'ef' | 'eF' | 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7' | 'E8' | 'E9' | 'Ea' | 'EA' | 'Eb' | 'EB' | 'Ec' | 'EC' | 'Ed' | 'ED' | 'Ee' | 'EE' | 'Ef' | 'EF' | 'f0' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'f9' | 'fa' | 'fA' | 'fb' | 'fB' | 'fc' | 'fC' | 'fd' | 'fD' | 'fe' | 'fE' | 'ff' | 'fF' | 'F0' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'Fa' | 'FA' | 'Fb' | 'FB' | 'Fc' | 'FC' | 'Fd' | 'FD' | 'Fe' | 'FE' | 'Ff' | 'FF';

/**
 * Represents a sequence of bytes with fixed length.
 *
 * @template L Length of byte sequence.
 */
export class ChainFixedBytes<L extends number> extends Type<string> implements ISerializable<string> {

  //#region ~Fields~

  /**
   * The value for implementation of internal logic.
   */
  private readonly _internalValue: Tuple<Byte, L>;

  //#endregion

  //#region ~Constructor~

  constructor(value: Tuple<Byte, L>) {
    super(value.reduce((result, value) => result + value, ''));
    this._internalValue = value;
    if (this._internalValue.length === 0) {
      throw new ValidationError('Byte sequence cannot be equal to 0.');
    }
  }

  //#endregion

  //#region ~ISerializable~

  protected valid(): boolean {
    return /^[0-9a-fA-F]+$/.test(this.value());
  }

  public bytes(): string {
    let b = Buffer.from(this.value(), 'hex');
    let bb = new ByteBuffer(b.length, true);
    bb.append(b.toString('binary'), 'binary');
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainFixedBytes object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainFixedBytes object.
   *
   * @returns {ChainFixedBytes} New instance of ChainFixedBytes object.
   */
  static fromBytes(bytes: string): ChainFixedBytes<number> {
    assertBytes(bytes);
    return ChainFixedBytes.fromValue(bytes);
  }

  /**
   * Creates instance of ChainFixedBytes object using its value.
   *
   * @param {string} value Value to create instance of ChainFixedBytes object.
   *
   * @returns {ChainFixedBytes} New instance of ChainFixedBytes object.
   */
  static fromValue(value: string): ChainFixedBytes<number> {
    assertBytes(value);
    const bytes = value.match(/.{2}/g);
    if (bytes === null) {
      throw new ValidationError('Value cannot be parsed to byte sequence.');
    }
    return new ChainFixedBytes<typeof bytes.length>(bytes.map(b => b) as Tuple<Byte, typeof bytes.length>);
  }

  //#endregion

}

/**
 * Represents a sequence of bytes with unknown length.
 */
export class ChainBytes extends Type<string> implements ISerializable<string> {

  //#region ~Constructor~

  constructor(value: Tuple<Byte, number>) {
    super(value.reduce((result, value) => result + value, ''));
  }

  //#endregion

  //#region ~ISerializable~

  protected valid(): boolean {
    return /^[0-9a-fA-F]+$/.test(this.value());
  }

  public bytes(): string {
    let b = Buffer.from(this.value(), 'hex');
    let bb = new ByteBuffer(b.length + 4, true);
    bb.writeVarint32(b.length);
    bb.append(b.toString('binary'), 'binary');
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of ChainFixedBytes object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of ChainFixedBytes object.
   *
   * @returns {ChainFixedBytes} New instance of ChainFixedBytes object.
   */
  static fromBytes(bytes: string): ChainFixedBytes<number> {
    assertBytes(bytes);
    return ChainFixedBytes.fromValue(bytes);
  }

  /**
   * Creates instance of ChainFixedBytes object using its value.
   *
   * @param {string} value Value to create instance of ChainFixedBytes object.
   *
   * @returns {ChainFixedBytes} New instance of ChainFixedBytes object.
   */
  static fromValue(value: string): ChainFixedBytes<number> {
    assertBytes(value);
    const bytes = value.match(/.{2}/g);
    if (bytes === null) {
      throw new ValidationError('Value cannot be parsed to byte sequence.');
    }
    return new ChainFixedBytes<number>(bytes.map(b => b) as Tuple<Byte, number>);
  }

  //#endregion

}