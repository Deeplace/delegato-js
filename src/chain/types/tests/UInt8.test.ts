import assert from 'assert';
import { ValidationError } from '../../error';
import ChainUInt8 from '../UInt8';

describe('UInt8', function () {

  describe('has correct constants of', function () {
    it('lower bound value', function () {
      assert.strictEqual(ChainUInt8.MinValue, 0);
    });

    it('upper bound value', function () {
      assert.strictEqual(ChainUInt8.MaxValue, 255);
    });
  });

  describe('correctly serializes to byte sequence from', function () {

    it('lower bound value', function () {
      const value = 0;
      const expected = '00';
      assert.strictEqual(new ChainUInt8(value).bytes(), expected);
    });

    it('upper bound value', function () {
      const value = 2 ** 8 - 1;
      const expected = 'ff';
      assert.strictEqual(new ChainUInt8(value).bytes(), expected);
    });

    it('any other value', function () {
      const value = 123;
      const expected = '7b';
      assert.strictEqual(new ChainUInt8(value).bytes(), expected);
    });
  });

  describe('returns correct wrapped value on', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(new ChainUInt8(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 8 - 1;
      assert.strictEqual(new ChainUInt8(value).value(), value);
    });

    it('any other value', function () {
      const value = 123;
      assert.strictEqual(new ChainUInt8(value).value(), value);
    });

  });

  describe('throws an ValidationError on value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => new ChainUInt8(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 8;
      assert.throws(() => new ChainUInt8(value), ValidationError);
    });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('lower bound value', function () {
      const value = '00';
      const expected = 0;
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), expected);
    });

    it('upper bound value', function () {
      const value = 'ff';
      const expected = 2 ** 8 - 1;
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), expected);
    });

    it('any other value', function () {
      const value = '20';
      const expected = 32;
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of length less than 1 byte', function () {
      const value = '1';
      assert.throws(() => ChainUInt8.fromBytes(value), ValidationError);
    });

    it('of length greater than 1 byte', function () {
      const value = '123';
      assert.throws(() => ChainUInt8.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = 'fg';
      assert.throws(() => ChainUInt8.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(ChainUInt8.fromValue(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 8 - 1;
      assert.strictEqual(ChainUInt8.fromValue(value).value(), value);
    });

    it('any other value', function () {
      const value = 123;
      assert.strictEqual(ChainUInt8.fromValue(value).value(), value);
    });

  });

  describe('throws ValidationError on generating from value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => ChainUInt8.fromValue(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 8;
      assert.throws(() => ChainUInt8.fromValue(value), ValidationError);
    });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = 'ff';
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), ChainUInt8.MaxValue);
    });

    it('uppercase value', function () {
      const value = 'FF';
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), ChainUInt8.MaxValue);
    });

    it('mixed case value', function () {
      const value = 'fF';
      assert.strictEqual(ChainUInt8.fromBytes(value).value(), ChainUInt8.MaxValue);
    });

  });

});