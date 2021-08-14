import assert from 'assert';
import { PrivateKey, PrivateKeyType, Signature } from '../../..';
import { LogicError } from '../../error';
import { Alg, Typ } from '../Header';
import Token from '../Token';


describe('Token', function () {
  const alg = Alg.Es256;
  const typ = Typ.Jwt;
  const sub = 'example@email.com';
  const pk1 = PrivateKey.create(sub, '1234567890ABCD', PrivateKeyType.active);
  const pk2 = PrivateKey.create(sub, '1234567890ABCD', PrivateKeyType.owner);
  const iss = sub;
  const iat1 = Math.floor(Date.now() / 1000);
  const iat2 = 859438800;
  const token1 = new Token(pk1, sub, iss);
  const token2 = new Token(pk1, sub, iss, iat2);
  const token3 = new Token(pk2, sub, iss, iat2);
  const token4 = new Token();
  const signature2 = '1f6bf49246522f7c0884c2285f10bd8207129e7742d82a02de0c95b335376889d82a690d520ae5543dd2efef314d7fad789e5ce5298f6e08dbbbdbe2b9b4d6ddeb';
  const signature3 = '202858ecb55689501ef9f901755fb2bd5111724643f21cb25ae5b976c79a8d67436033bba6e00e20e4b83303f398b3873907d77fd6a63a81c3a806760c72b0cd56';
  const base64_2 = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlQGVtYWlsLmNvbSIsImlzcyI6ImV4YW1wbGVAZW1haWwuY29tIiwiaWF0Ijo4NTk0Mzg4MDB9.H2v0kkZSL3wIhMIoXxC9ggcSnndC2CoC3gyVszU3aInYKmkNUgrlVD3S7+8xTX+teJ5c5SmPbgjbu9viubTW3es=';
  const base64_3 = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlQGVtYWlsLmNvbSIsImlzcyI6ImV4YW1wbGVAZW1haWwuY29tIiwiaWF0Ijo4NTk0Mzg4MDB9.IChY7LVWiVAe+fkBdV+yvVERckZD8hyyWuW5dseajWdDYDO7puAOIOS4MwPzmLOHOQfXf9amOoHDqAZ2DHKwzVY=';

  describe('with uninitialized "iat" property', function () {
    const header1 = Buffer.from(`{"alg":"${alg}","typ":"${typ}"}`).toString('base64');
    const payload1_1 = Buffer.from(`{"sub":"${sub}","iss":"${iss}","iat":${iat1}}`).toString('base64');
    const payload1_2 = Buffer.from(`{"sub":"${sub}","iss":"${iss}","iat":${iat1 + 1}}`).toString('base64');
    const signature1_1 = new Signature(Buffer.from(`${header1}.${payload1_1}`).toString('hex'), pk1);
    const signature1_2 = new Signature(Buffer.from(`${header1}.${payload1_2}`).toString('hex'), pk1);
    const base64_1_1 = `${header1}.${payload1_1}.${Buffer.from(signature1_1.bytes(), 'hex').toString('base64')}`;
    const base64_1_2 = `${header1}.${payload1_2}.${Buffer.from(signature1_2.bytes(), 'hex').toString('base64')}`;

    describe('correctly initializes', function () {
      it('"header" property', function () {
        assert.strictEqual(token1.header.alg, alg);
        assert.strictEqual(token1.header.typ, typ);
      });

      it('"payload" property', function () {
        assert.strictEqual(token1.payload.sub, sub);
        assert.strictEqual(token1.payload.iss, iss);
        try {
          assert.strictEqual(token1.payload.iat, iat1);
        }
        catch (e) {
          assert.strictEqual(token1.payload.iat, iat1 + 1);
        }
      });

      it('"signature" property', function () {
        try {
          assert.strictEqual(token1.signature.value(), signature1_1.value());
        }
        catch (e) {
          assert.strictEqual(token1.signature.value(), signature1_2.value());
        }
      });
    });

    describe('correctly serializes to', function () {
      it('base64 encoded string', function () {
        try {
          assert.strictEqual(token1.base64(), base64_1_1);
        }
        catch (e) {
          assert.strictEqual(token1.base64(), base64_1_2);
        }
      });
    });
  });

  describe('initialized with "active" key', function () {
    describe('correctly initializes', function () {
      it('"header" property', function () {
        assert.strictEqual(token2.header.alg, alg);
        assert.strictEqual(token2.header.typ, typ);
      });

      it('"payload" property', function () {
        assert.strictEqual(token2.payload.sub, sub);
        assert.strictEqual(token2.payload.iss, iss);
        assert.strictEqual(token2.payload.iat, iat2);
      });

      it('"signature" property', function () {
        assert.strictEqual(token2.signature.value(), signature2);
      });
    });

    describe('correctly serializes to', function () {
      it('base64 encoded string', function () {
        assert.strictEqual(token2.base64(), base64_2);
      });
    });

    describe('generates correct instance from', function () {
      it('base64 encoded string', function () {
        const token = Token.fromBase64(base64_2);
        assert.strictEqual(token.header.alg, alg);
        assert.strictEqual(token.header.typ, typ);
        assert.strictEqual(token.payload.sub, sub);
        assert.strictEqual(token.payload.iss, iss);
        assert.strictEqual(token.payload.iat, iat2);
        assert.strictEqual(token.signature.value(), signature2);
      });
    });
  });

  describe('initialized with "owner" key', function () {
    describe('correctly initializes', function () {
      it('"header" property', function () {
        assert.strictEqual(token3.header.alg, alg);
        assert.strictEqual(token3.header.typ, typ);
      });

      it('"payload" property', function () {
        assert.strictEqual(token3.payload.sub, sub);
        assert.strictEqual(token3.payload.iss, iss);
        assert.strictEqual(token3.payload.iat, iat2);
      });

      it('"signature" property', function () {
        assert.strictEqual(token3.signature.value(), signature3);
      });
    });

    describe('correctly serializes to', function () {
      it('base64 encoded string', function () {
        assert.strictEqual(token3.base64(), base64_3);
      });
    });

    describe('generates correct instance from', function () {
      it('base64 encoded string', function () {
        const token = Token.fromBase64(base64_3);
        assert.strictEqual(token.header.alg, alg);
        assert.strictEqual(token.header.typ, typ);
        assert.strictEqual(token.payload.sub, sub);
        assert.strictEqual(token.payload.iss, iss);
        assert.strictEqual(token.payload.iat, iat2);
        assert.strictEqual(token.signature.value(), signature3);
      });
    });
  });

  describe('without initialization', function () {
    describe('correctly initializes', function () {
      it('"header" property', function () {
        assert.strictEqual(token4.header.alg, alg);
        assert.strictEqual(token4.header.typ, typ);
      });
    });

    describe('throws LogicError', function () {
      it('getting "payload" property', function () {
        assert.throws(() => console.log(token4.payload), LogicError);
      });

      it('getting "signature" property', function () {
        assert.throws(() => console.log(token4.signature), LogicError);
      });

      it('calling "base64" method', function () {
        assert.throws(() => token4.base64(), LogicError);
      });
    });
  });

  // TODO: test fromBase64
});
