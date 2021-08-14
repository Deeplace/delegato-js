import createHash from "create-hash";
import createHmac from "create-hmac";
import { BinaryLike } from "crypto";

type Encoding = 'utf8' | 'hex' | 'base64';
type Data = string | Buffer | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | DataView;

function sha1(data: Data): Buffer;
function sha1(data: Data, encoding: Encoding): string;
function sha1(data: Data, encoding?: Encoding) {
  return encoding === undefined ?
    createHash("sha1").update(data).digest() :
    createHash("sha1").update(data).digest(encoding);
}

function sha256(data: Data): Buffer;
function sha256(data: Data, encoding: Encoding): string;
function sha256(data: Data, encoding?: Encoding) {
  return encoding === undefined ?
    createHash("sha256").update(data).digest() :
    createHash("sha256").update(data).digest(encoding);
}

function sha512(data: Data): Buffer;
function sha512(data: Data, encoding: Encoding): string;
function sha512(data: Data, encoding?: Encoding) {
  return encoding === undefined ?
    createHash("sha512").update(data).digest() :
    createHash("sha512").update(data).digest(encoding);
}

function hmacSha256(buffer: BinaryLike, secret: string | Buffer) {
  return createHmac("sha256", secret)
    .update(buffer)
    .digest();
}

function ripemd160(data: Data) {
  return createHash("rmd160")
    .update(data)
    .digest();
}

export { sha1, sha256, sha512, hmacSha256, ripemd160 };