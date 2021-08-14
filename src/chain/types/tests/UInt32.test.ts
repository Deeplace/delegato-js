import assert from 'assert';
import { ValidationError } from '../../error';
import ChainUInt32 from '../UInt32';

describe('UInt32', function () {

  describe('has correct constants of', function () {
    it('lower bound value', function () {
      assert.strictEqual(ChainUInt32.MinValue, 0);
    });

    it('upper bound value', function () {
      assert.strictEqual(ChainUInt32.MaxValue, 4_294_967_295);
    });
  });

  describe('correctly serializes to byte sequence from', function () {

    it('lower bound value', function () {
      const value = 0;
      const expected = '00000000';
      assert.strictEqual(new ChainUInt32(value).bytes(), expected);
    });

    it('upper bound value', function () {
      const value = 2 ** 32 - 1;
      const expected = 'ffffffff';
      assert.strictEqual(new ChainUInt32(value).bytes(), expected);
    });

    it('any other value', function () {
      const value = 123456;
      const expected = '40e20100';
      assert.strictEqual(new ChainUInt32(value).bytes(), expected);
    });
  });

  describe('returns correct wrapped value on', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(new ChainUInt32(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 32 - 1;
      assert.strictEqual(new ChainUInt32(value).value(), value);
    });

    it('any other value', function () {
      const value = 123456;
      assert.strictEqual(new ChainUInt32(value).value(), value);
    });

  });

  describe('throws an ValidationError on value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => new ChainUInt32(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 32;
      assert.throws(() => new ChainUInt32(value), ValidationError);
    });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('lower bound value', function () {
      const value = '00000000';
      const expected = 0;
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), expected);
    });

    it('upper bound value', function () {
      const value = 'ffffffff';
      const expected = 2 ** 32 - 1;
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), expected);
    });

    it('any other value', function () {
      const value = 'f1fb0900';
      const expected = 654321;
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of length less than 4 bytes', function () {
      const value = '1234567';
      assert.throws(() => ChainUInt32.fromBytes(value), ValidationError);
    });

    it('of length greater than 4 bytes', function () {
      const value = '123456789';
      assert.throws(() => ChainUInt32.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = '000000fg';
      assert.throws(() => ChainUInt32.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(ChainUInt32.fromValue(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 32 - 1;
      assert.strictEqual(ChainUInt32.fromValue(value).value(), value);
    });

    it('any other value', function () {
      const value = 123456;
      assert.strictEqual(ChainUInt32.fromValue(value).value(), value);
    });

  });

  describe('throws ValidationError on generating from value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => ChainUInt32.fromValue(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 32;
      assert.throws(() => ChainUInt32.fromValue(value), ValidationError);
    });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = 'ffffffff';
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), ChainUInt32.MaxValue);
    });

    it('uppercase value', function () {
      const value = 'FFFFFFFF';
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), ChainUInt32.MaxValue);
    });

    it('mixed case value', function () {
      const value = 'fFfFfFfF';
      assert.strictEqual(ChainUInt32.fromBytes(value).value(), ChainUInt32.MaxValue);
    });

  });

});