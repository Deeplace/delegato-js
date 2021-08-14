import assert from 'assert';
import { ValidationError } from '../../error';
import ChainUInt16 from '../UInt16';

describe('UInt16', function () {

  describe('has correct constants of', function () {
    it('lower bound value', function () {
      assert.strictEqual(ChainUInt16.MinValue, 0);
    });

    it('upper bound value', function () {
      assert.strictEqual(ChainUInt16.MaxValue, 65_535);
    });
  });

  describe('correctly serializes to byte sequence from', function () {

    it('lower bound value', function () {
      const value = 0;
      const expected = '0000';
      assert.strictEqual(new ChainUInt16(value).bytes(), expected);
    });

    it('upper bound value', function () {
      const value = 2 ** 16 - 1;
      const expected = 'ffff';
      assert.strictEqual(new ChainUInt16(value).bytes(), expected);
    });

    it('any other value', function () {
      const value = 12345;
      const expected = '3930';
      assert.strictEqual(new ChainUInt16(value).bytes(), expected);
    });
  });

  describe('returns correct wrapped value on', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(new ChainUInt16(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 16 - 1;
      assert.strictEqual(new ChainUInt16(value).value(), value);
    });

    it('any other value', function () {
      const value = 12345;
      assert.strictEqual(new ChainUInt16(value).value(), value);
    });

  });

  describe('throws an ValidationError on value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => new ChainUInt16(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 16;
      assert.throws(() => new ChainUInt16(value), ValidationError);
    });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('lower bound value', function () {
      const value = '0000';
      const expected = 0;
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), expected);
    });

    it('upper bound value', function () {
      const value = 'ffff';
      const expected = 2 ** 16 - 1;
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), expected);
    });

    it('any other value', function () {
      const value = '31d4';
      const expected = 54321;
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of length less than 4 bytes', function () {
      const value = '123';
      assert.throws(() => ChainUInt16.fromBytes(value), ValidationError);
    });

    it('of length greater than 4 bytes', function () {
      const value = '12345';
      assert.throws(() => ChainUInt16.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = '00fg';
      assert.throws(() => ChainUInt16.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(ChainUInt16.fromValue(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 16 - 1;
      assert.strictEqual(ChainUInt16.fromValue(value).value(), value);
    });

    it('any other value', function () {
      const value = 12345;
      assert.strictEqual(ChainUInt16.fromValue(value).value(), value);
    });

  });

  describe('throws ValidationError on generating from value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => ChainUInt16.fromValue(value), ValidationError);
    });

    it('greater than upper bound', function () {
      const value = 2 ** 16;
      assert.throws(() => ChainUInt16.fromValue(value), ValidationError);
    });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = 'ffff';
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), ChainUInt16.MaxValue);
    });

    it('uppercase value', function () {
      const value = 'FFFF';
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), ChainUInt16.MaxValue);
    });

    it('mixed case value', function () {
      const value = 'fFfF';
      assert.strictEqual(ChainUInt16.fromBytes(value).value(), ChainUInt16.MaxValue);
    });

  });

});