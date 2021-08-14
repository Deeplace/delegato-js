import assert from 'assert';
import BigInteger from "bigi";
import { Curve, Point } from "ecurve";
import ECSignature from "./ECSignature";
import { hmacSha256, sha256 } from "./hash";

function deterministicGenerateK(curve: Curve, hash: Buffer, d: BigInteger, checkSig: Function, nonce: number) {
  if (nonce) {
    hash = sha256(Buffer.concat([hash, Buffer.alloc(nonce)]));
  }

  // sanity check
  assert.strictEqual(hash.length, 32, "Hash must be 256 bit");

  var x = d.toBuffer(32);
  var k = Buffer.alloc(32);
  var v = Buffer.alloc(32);

  // Step B
  v.fill(1);

  // Step C
  k.fill(0);

  // Step D
  k = hmacSha256(Buffer.concat([v, Buffer.from([0]), x, hash]), k);

  // Step E
  v = hmacSha256(v, k);

  // Step F
  k = hmacSha256(Buffer.concat([v, Buffer.from([1]), x, hash]), k);

  // Step G
  v = hmacSha256(v, k);

  // Step H1/H2a, ignored as tlen === qlen (256 bit)
  // Step H2b
  v = hmacSha256(v, k);

  var T = BigInteger.fromBuffer(v);

  // Step H3, repeat until T is within the interval [1, n - 1]
  while (T.signum() <= BigInteger.ZERO || T.compareTo(curve.n) >= 0 || !checkSig(T)) {
    k = hmacSha256(Buffer.concat([v, Buffer.from([0])]), k);
    v = hmacSha256(v, k);

    // Step H1/H2a, again, ignored as tlen === qlen (256 bit)
    // Step H2b again
    v = hmacSha256(v, k);

    T = BigInteger.fromBuffer(v);
  }

  return T;
}

export function sign(curve: Curve, hash: Buffer, d: BigInteger, nonce: number) {
  const e = BigInteger.fromBuffer(hash);
  const n = curve.n;
  const G = curve.G;

  let r: BigInteger = BigInteger.ZERO;
  let s: BigInteger = BigInteger.ZERO;

  deterministicGenerateK(
    curve,
    hash,
    d,
    function (k: BigInteger) {
      // find canonically valid signature
      let Q = G.multiply(k);

      if (curve.isInfinity(Q)) return false;

      r = Q.affineX.mod(n);
      if (r.signum() === BigInteger.ZERO) return false;

      s = k
        // @ts-ignore
        .modInverse(n)
        .multiply(e.add(d.multiply(r)))
        .mod(n);
      if (s.signum() === BigInteger.ZERO) return false;

      return true;
    },
    nonce
  );

  let N_OVER_TWO = n.shiftRight(1);

  // enforce low S values, see bip62: 'low s values in signatures'
  if (s.compareTo(N_OVER_TWO) > 0) {
    s = n.subtract(s);
  }

  return new ECSignature(r, s);
}

export function verifyRaw(curve: Curve, e: BigInteger, signature: ECSignature, Q: Point) {
  let n = curve.n;
  let G = curve.G;

  let r = signature.r;
  let s = signature.s;

  // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
  if (r.signum() <= BigInteger.ZERO || r.compareTo(n) >= 0) return false;
  if (s.signum() <= BigInteger.ZERO || s.compareTo(n) >= 0) return false;

  // c = s^-1 mod n
  let c = s.modInverse(n.intValue());

  // 1.4.4 Compute u1 = es^−1 mod n
  //               u2 = rs^−1 mod n
  let u1 = e.multiply(c).mod(n);
  let u2 = r.multiply(c).mod(n);

  // 1.4.5 Compute R = (xR, yR) = u1G + u2Q
  let R = G.multiplyTwo(u1, Q, u2);

  // 1.4.5 (cont.) Enforce R is not at infinity
  if (curve.isInfinity(R)) return false;

  // 1.4.6 Convert the field element R.x to an integer
  let xR = R.affineX;

  // 1.4.7 Set v = xR mod n
  let v = xR.mod(n);

  // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
  return v.equals(r);
}

export function verify(curve: Curve, hash: Buffer, signature: ECSignature, Q: Point) {
  // 1.4.2 H = Hash(M), already done by the user
  // 1.4.3 e = H
  let e = BigInteger.fromBuffer(hash);
  return verifyRaw(curve, e, signature, Q);
}

/**
* Recover a public key from a signature.
*
* See SEC 1: Elliptic Curve Cryptography, section 4.1.6, "Public
* Key Recovery Operation".
*
* http://www.secg.org/download/aid-780/sec1-v2.pdf
*/
export function recoverPubKey(curve: Curve, e: BigInteger, signature: ECSignature, i: number) {
  assert.strictEqual(i & 3, i, "Recovery param is more than two bits");

  let n = curve.n;
  let G = curve.G;

  let r = signature.r;
  let s = signature.s;

  assert(r.signum() > BigInteger.ZERO && r.compareTo(n) < 0, "Invalid r value");
  assert(s.signum() > BigInteger.ZERO && s.compareTo(n) < 0, "Invalid s value");

  // A set LSB signifies that the y-coordinate is odd
  let isYOdd = (i & 1) != 0;

  // The more significant bit specifies whether we should use the
  // first or second candidate key.
  let isSecondKey = i >> 1;

  // 1.1 Let x = r + jn
  let x = isSecondKey ? r.add(n) : r;
  // @ts-ignore
  let R = curve.pointFromX(isYOdd, x);

  // 1.4 Check that nR is at infinity
  let nR = R.multiply(n);
  assert(curve.isInfinity(nR), "nR is not a valid curve point");

  // Compute -e from e
  let eNeg = e.negate().mod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  // @ts-ignore
  let rInv = r.modInverse(n);

  let Q = R.multiplyTwo(s, G, eNeg).multiply(rInv);
  curve.validate(Q);

  return Q;
}

/**
* Calculate pubkey extraction parameter.
*
* When extracting a pubkey from a signature, we have to
* distinguish four different cases. Rather than putting this
* burden on the verifier, Bitcoin includes a 2-bit value with the
* signature.
*
* This function simply tries all four cases and returns the value
* that resulted in a successful pubkey recovery.
*/
export function calcPubKeyRecoveryParam(curve: Curve, e: BigInteger, signature: ECSignature, Q: Point) {
  for (let i = 0; i < 4; i++) {
    let Qprime = recoverPubKey(curve, e, signature, i);

    // 1.6.2 Verify Q
    if (Qprime.equals(Q)) {
      return i;
    }
  }

  throw new Error("Unable to find valid recovery factor");
}