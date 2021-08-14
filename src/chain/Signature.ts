import BigInteger from "bigi";
import ByteBuffer from "bytebuffer";
import { getCurveByName } from "ecurve";
import { ISerializable, LogicError, PrivateKey, ValidationError } from ".";
import { calcPubKeyRecoveryParam, sha256, sign } from "../ecc";

const secp256k1 = getCurveByName("secp256k1");

/**
 * Signed with private key byte sequence.
 */
export default class Signature implements ISerializable<string> {

  //#region ~Fields~

  private r?: BigInteger;
  private s?: BigInteger;
  private i?: number;

  //#endregion

  //#region ~Constructor~

  constructor();
  constructor(bytes: string, privateKey: PrivateKey);
  constructor(bytes?: string, privateKey?: PrivateKey) {
    if (bytes == undefined || privateKey == undefined) {
      return;
    }
    let b = Buffer.from(bytes, 'hex');
    let bufSha256 = sha256(b);
    let der, e, ecsignature, i, lenR, lenS, nonce;
    i = null;
    nonce = 0;
    e = BigInteger.fromBuffer(bufSha256);
    while (true) {
      ecsignature = sign(secp256k1, bufSha256, privateKey.d, nonce++);
      der = ecsignature.toDER();
      lenR = der[3];
      lenS = der[5 + lenR];
      if (lenR === 32 && lenS === 32) {
        i = calcPubKeyRecoveryParam(secp256k1, e, ecsignature, privateKey.publicKey.Q);
        i += 4;  // Compressed.
        i += 27; // Compact. 24 or 27 (forcing odd-y 2nd key candidate).
        break;
      }
      if (nonce % 10 === 0) {
        console.log(`WARN: ${nonce} attempts to find canonical signature.`);
      }
    }
    this.r = ecsignature.r;
    this.s = ecsignature.s;
    this.i = i;
  }

  //#endregion

  //#region ~ISerializable~

  value(): string {
    return this.bytes();
  }

  bytes(): string {
    if (this.r === undefined || this.s === undefined || this.i === undefined) {
      throw new LogicError("Signature is not initialized.");
    }
    let b = Buffer.alloc(65);
    b.writeUInt8(this.i, 0);
    this.r.toBuffer(32).copy(b, 1);
    this.s.toBuffer(32).copy(b, 33);
    return b.toString('hex');
  }

  //#endregion

  //#region ~Static methods~

  static fromValue(value: string): Signature {
    return Signature.fromBytes(value);
  }

  static fromBytes(bytes: string): Signature {
    const length = 65;
    if (length !== undefined && bytes.length !== length * 2) {
      throw new ValidationError(`Invalid string length. Expected value "${length * 2}", "${bytes.length}" given.`);
    }
    if (!/^([0-9a-fA-F]{2})+$/.test(bytes)) {
      throw new ValidationError('Given string is not a byte sequence.');
    }
    let bb = ByteBuffer.fromHex(bytes, true);
    let signature = new Signature();
    signature.i = bb.readUint8(0);
    signature.r = BigInteger.fromHex(bb.readBytes(32, 1).toString('hex'));
    signature.s = BigInteger.fromHex(bb.readBytes(32, 33).toString('hex'));
    return signature;
  }

  //#endregion

}