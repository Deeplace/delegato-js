import BigInteger from "bigi";
import assert from "assert";

export default class ECSignature {
  r: BigInteger;
  s: BigInteger;

  constructor(r: BigInteger, s: BigInteger) {
    this.r = r;
    this.s = s;
  }

  public static parseCompact(buffer: Buffer) {
    assert.strictEqual(buffer.length, 65, "Invalid signature length");
    var i = buffer.readUInt8(0) - 27;

    // At most 3 bits
    assert.strictEqual(i, i & 7, "Invalid signature parameter");
    var compressed = !!(i & 4);

    // Recovery param only
    i = i & 3;

    var r = BigInteger.fromBuffer(buffer.slice(1, 33));
    var s = BigInteger.fromBuffer(buffer.slice(33));

    return {
      compressed: compressed,
      i: i,
      signature: new ECSignature(r, s)
    };
  }

  public static fromDER(buffer: Buffer) {
    assert.strictEqual(buffer.readUInt8(0), 0x30, "Not a DER sequence");
    assert.strictEqual(
      buffer.readUInt8(1),
      buffer.length - 2,
      "Invalid sequence length"
    );
    assert.strictEqual(buffer.readUInt8(2), 0x02, "Expected a DER integer");

    var rLen = buffer.readUInt8(3);
    assert(rLen > 0, "R length is zero");

    var offset = 4 + rLen;
    assert.strictEqual(buffer.readUInt8(offset), 0x02, "Expected a DER integer (2)");

    var sLen = buffer.readUInt8(offset + 1);
    assert(sLen > 0, "S length is zero");

    var rB = buffer.slice(4, offset);
    var sB = buffer.slice(offset + 2);
    offset += 2 + sLen;

    if (rLen > 1 && rB.readUInt8(0) === 0x00) {
      assert(rB.readUInt8(1) & 0x80, "R value excessively padded");
    }

    if (sLen > 1 && sB.readUInt8(0) === 0x00) {
      assert(sB.readUInt8(1) & 0x80, "S value excessively padded");
    }

    assert.strictEqual(offset, buffer.length, "Invalid DER encoding");
    var r = BigInteger.fromBuffer(rB);
    var s = BigInteger.fromBuffer(sB);

    assert(r.signum() >= BigInteger.ZERO, "R value is negative");
    assert(s.signum() >= BigInteger.ZERO, "S value is negative");

    return new ECSignature(r, s);
  }

  public static parseScriptSignature(buffer: Buffer) {
    var hashType = buffer.readUInt8(buffer.length - 1);
    var hashTypeMod = hashType & ~0x80;

    assert(hashTypeMod > 0x00 && hashTypeMod < 0x04, "Invalid hashType");

    return {
      signature: ECSignature.fromDER(buffer.slice(0, -1)),
      hashType: hashType
    };
  }

  public toCompact(i: number, compressed: boolean) {
    if (compressed) i += 4;
    i += 27;

    var buffer = Buffer.alloc(65);
    buffer.writeUInt8(i, 0);

    this.r.toBuffer(32).copy(buffer, 1);
    this.s.toBuffer(32).copy(buffer, 33);

    return buffer;
  }

  public toDER() {
    var rBa = this.r.toDERInteger();
    var sBa = this.s.toDERInteger();

    var sequence = [];

    // INTEGER
    sequence.push(0x02, rBa.length);
    sequence = sequence.concat(rBa);

    // INTEGER
    sequence.push(0x02, sBa.length);
    sequence = sequence.concat(sBa);

    // SEQUENCE
    sequence.unshift(0x30, sequence.length);

    return Buffer.from(sequence);
  }

  public toScriptSignature(hashType: number) {
    var hashTypeBuffer = Buffer.alloc(1);
    hashTypeBuffer.writeUInt8(hashType, 0);

    return Buffer.concat([this.toDER(), hashTypeBuffer]);
  }
}