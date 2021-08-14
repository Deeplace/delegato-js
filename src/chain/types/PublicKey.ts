import { decode, encode } from "bs58";
import ByteBuffer from "bytebuffer";
import { getCurveByName, Point } from "ecurve";
import { ISerializable, ValidationError } from "..";
import { ripemd160, sha256 } from "../../ecc";

const secp256k1 = getCurveByName("secp256k1");

type PublicKeyValue = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [[string, 1]],
  address_auths: []
};

/**
 * The public key. This key may not be kept in secret.
 */
export default class PublicKey implements ISerializable<PublicKeyValue> {

  //#region ~Constants~

  public static readonly addressPrefix = 'BTS';

  //#endregion

  //#region ~Fields~

  readonly Q: Point;

  //#endregion

  constructor(Q: Point) {
    this.Q = Q;
  }

  //#region ~ISerializable~

  value(): PublicKeyValue {
    let thisObj = this;
    return {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[thisObj.wif(), 1]],
      address_auths: []
    };
  }

  bytes(): string {
    let b = this.Q.getEncoded();
    let bb = new ByteBuffer(42, true);
    bb.append('010000000001', 'hex');
    bb.append(b.toString('binary'), 'binary');
    bb.append('010000', 'hex');
    return bb.toHex(0, bb.offset);
  }

  //#endregion

  //#region ~Methods~

  /**
   * Gets representation of this public key in wallet import format.
   *
   * @returns {string} Representation of public key in wallet import format.
   */
  wif(): string {
    let b = this.Q.getEncoded();
    let checksum = ripemd160(b);
    let addy = Buffer.concat([b, checksum.slice(0, 4)]);
    return `${PublicKey.addressPrefix}${encode(addy)}`;
  }

  /**
   * Get wallet address.
   *
   * @returns {string} Wallet address in wallet import format.
   */
  address(): string {
    let b = this.Q.getEncoded();
    let sha = sha256(b);
    let addy = ripemd160(sha);
    addy = Buffer.concat([Buffer.from([0x38]), addy]); // Version 56 (decimal).

    let checksum = sha256(addy);
    checksum = sha256(checksum);

    addy = Buffer.concat([addy, checksum.slice(0, 4)]);
    return encode(addy);
  }

  /**
   * Gets point of this public key.
   *
   * @returns {Point} Point of public key.
   */
  point(): Point {
    return this.Q;
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of PublicKey object using its value.
   *
   * @param {string} value Value to create instance of PublicKey object.
   *
   * @returns {PublicKey} New instance of PublicKey object.
   */
  static fromValue(value: PublicKeyValue): PublicKey {
    return PublicKey.fromWif(value.key_auths[0][0]);
  }

  /**
   * Creates instance of PublicKey object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of PublicKey object.
   *
   * @returns {PublicKey} New instance of PublicKey object.
   */
  static fromBytes(bytes: string): PublicKey {
    const b = Buffer.from(bytes, 'hex');
    return PublicKey.fromPoint(Point.decodeFrom(secp256k1, b));
  }

  /**
   * Creates instance of PublicKey from wallet import format.
   *
   * @param {string} wif Value in wallet import format to create instance of PublicKey object.
   *
   * @returns {PublicKey} New instance of PublicKey object.
   */
  static fromWif(wif: string): PublicKey {
    let prefix = wif.slice(0, PublicKey.addressPrefix.length);
    if (PublicKey.addressPrefix !== prefix) {
      throw new ValidationError(`Expecting key to begin with ${PublicKey.addressPrefix}, instead got ${prefix}.`);
    }
    wif = wif.slice(PublicKey.addressPrefix.length);
    let pk = Buffer.from(decode(wif).toString('binary'), "binary");
    let checksum = pk.slice(-4);
    pk = pk.slice(0, -4);
    let newChecksum = ripemd160(pk);
    newChecksum = newChecksum.slice(0, 4);
    if (checksum.toString('hex') != newChecksum.toString('hex')) {
      throw new ValidationError("Checksum did not match.");
    }
    return PublicKey.fromBytes(pk.toString('hex'));
  }

  /**
   * Creates instance of PublicKey from Point.
   *
   * @param {Point} point Point to create instance of PublicKey object.
   *
   * @returns {PublicKey} New instance of PublicKey object.
   */
  static fromPoint(point: Point): PublicKey {
    return new PublicKey(point);
  }

  //#endregion

}
