export enum Alg {
  Es256 = 'ES256',
}

export enum Typ {
  Jwt = 'JWT',
}

export default class Header {
  protected _json?: string;
  protected _base64?: string;

  public readonly alg: Alg;
  public readonly typ: Typ;

  constructor(alg: Alg, typ: Typ) {
    this.alg = alg;
    this.typ = typ;
  }

  public json() {
    if (this._json === undefined) {
      this._json = JSON.stringify({
        alg: this.alg,
        typ: this.typ,
      });
    }
    return this._json;
  }

  public base64() {
    if (this._base64 === undefined) {
      this._base64 = Buffer.from(this.json()).toString('base64');
    }
    return this._base64;
  }
}