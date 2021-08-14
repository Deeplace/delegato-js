import assert from 'assert';
import Header, { Alg, Typ } from "../Header";

describe('Header', function () {
  const alg = Alg.Es256;
  const typ = Typ.Jwt;
  const header = new Header(alg, typ);

  describe('correctly initializes', function () {
    it('"alg" property', function () {
      assert.strictEqual(header.alg, alg);
    });

    it('"typ" property', function () {
      assert.strictEqual(header.typ, typ);
    });
  });

  describe('correctly serializes to', function () {
    it('json string', function () {
      assert.strictEqual(header.json(), `{"alg":"${alg}","typ":"${typ}"}`);
    });

    it('base64 encoded string', function () {
      assert.strictEqual(header.base64(), 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9');
    });
  });
});
