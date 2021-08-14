export default class Payload {
  protected _json?: string;
  protected _base64?: string;

  public readonly sub: string;
  public readonly iss: string;
  public readonly iat: number;

  constructor(sub: string, iss: string, iat?: number) {
    this.sub = sub;
    this.iss = iss;
    this.iat = iat === undefined ? Math.floor(Date.now() / 1000) : iat;
  }

  public json() {
    if (this._json === undefined) {
      this._json = JSON.stringify({
        sub: this.sub,
        iss: this.iss,
        iat: this.iat,
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