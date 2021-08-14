import { PrivateKey } from "../..";
import { Signature } from "../../chain";
import { LogicError, ValidationError } from "../error";
import Header, { Alg, Typ } from "./Header";
import Payload from "./Payload";

export default class Token {
  private readonly lifetime = 2592000;
  protected _header: Header;
  protected _payload?: Payload;
  protected _signature?: Signature;
  protected _base64?: string;

  constructor();
  constructor(pk: PrivateKey, sub: string, iss: string, iat?: number);
  constructor(pk?: PrivateKey, sub?: string, iss?: string, iat?: number) {
    this._header = new Header(Alg.Es256, Typ.Jwt);
    if (pk === undefined || sub === undefined || iss === undefined) {
      return;
    }
    this._payload = new Payload(sub, iss, iat);
    this._signature = new Signature(Buffer.from(`${this._header.base64()}.${this._payload.base64()}`).toString('hex'), pk);
  }

  public get header() {
    return this._header;
  }

  public get payload() {
    if (this._payload === undefined) {
      throw new LogicError('Token is not initialized.');
    }
    return this._payload;
  }

  public get signature() {
    if (this._signature === undefined) {
      throw new LogicError('Token is not initialized.');
    }
    return this._signature;
  }

  public get isExpired() {
    return Math.floor(Date.now() / 1000) > this.payload.iat + 2592000;
  }

  base64() {
    if (this._base64 === undefined) {
      let signature = Buffer.from(this.signature.bytes(), 'hex').toString('base64');
      this._base64 = `${this._header.base64()}.${this.payload.base64()}.${signature}`;
    }
    return this._base64;
  }

  static fromBase64(base64: string) {
    let token = new Token();
    let parts = base64.split('.'); //.map(base64 => Buffer.from(base64, 'base64').toString())
    if (parts.length != 3) {
      throw new ValidationError('The JWT must be in 3 parts.');
    }
    let header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    if (typeof header !== 'object' || !header.hasOwnProperty('alg') || !header.hasOwnProperty('typ')) {
      throw new ValidationError('Wrong header.');
    }
    let payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    if (typeof payload !== 'object' || !payload.hasOwnProperty('sub') || !payload.hasOwnProperty('iss') || !payload.hasOwnProperty('iat')) {
      throw new ValidationError('Wrong payload.');
    }
    token._header = new Header(header.alg, header.typ);
    token._payload = new Payload(payload.sub, payload.iss, payload.iat);
    token._signature = Signature.fromBytes(Buffer.from(parts[2], 'base64').toString('hex'));
    return token;
  }
}