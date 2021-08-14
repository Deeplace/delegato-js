import assert from 'assert';
import Payload from "../Payload";

describe('Payload', function () {
  const sub = 'example@email.com';
  const iss = sub;
  const iat1 = Math.floor(Date.now() / 1000);
  const iat2 = 859438800;
  const payload1 = new Payload(sub, iss);
  const payload2 = new Payload(sub, iss, 859438800);

  describe('with uninitialized "iat" property', function () {
    describe('correctly initializes', function () {
      it('"sub" property', function () {
        assert.strictEqual(payload1.sub, sub);
      });

      it('"iss" property', function () {
        assert.strictEqual(payload1.iss, iss);
      });

      it('"iat" property', function () {
        try {
          assert.strictEqual(payload1.iat, iat1);
        }
        catch (e) {
          assert.strictEqual(payload1.iat, iat1 + 1);
        }
      });
    });

    describe('correctly serializes to', function () {
      const json1 = `{"sub":"${sub}","iss":"${iss}","iat":${iat1}}`;
      const json2 = `{"sub":"${sub}","iss":"${iss}","iat":${iat1 + 1}}`;

      it('json string', function () {
        try {
          assert.strictEqual(payload1.json(), json1);
        }
        catch (e) {
          assert.strictEqual(payload1.json(), json2);
        }
      });

      it('base64 encoded string', function () {
        try {
          assert.strictEqual(payload1.base64(), Buffer.from(json1).toString('base64'));
        }
        catch (e) {
          assert.strictEqual(payload1.base64(), Buffer.from(json2).toString('base64'));
        }
      });
    });
  });

  describe('with initialized "iat" property', function () {
    describe('correctly initializes', function () {
      it('"sub" property', function () {
        assert.strictEqual(payload2.sub, sub);
      });

      it('"iss" property', function () {
        assert.strictEqual(payload2.iss, iss);
      });

      it('"iat" property', function () {
        assert.strictEqual(payload2.iat, iat2);
      });
    });

    describe('correctly serializes to', function () {
      it('json string', function () {
        assert.strictEqual(payload2.json(), `{"sub":"${sub}","iss":"${iss}","iat":${iat2}}`);
      });

      it('base64 encoded string', function () {
        assert.strictEqual(payload2.base64(), 'eyJzdWIiOiJleGFtcGxlQGVtYWlsLmNvbSIsImlzcyI6ImV4YW1wbGVAZW1haWwuY29tIiwiaWF0Ijo4NTk0Mzg4MDB9');
      });
    });
  });
});