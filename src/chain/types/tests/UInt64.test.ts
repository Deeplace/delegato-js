import assert from 'assert';
import { ValidationError } from '../../error';
import ChainUInt64 from '../UInt64';

/**
 * These tests will be updated later.
 */

describe('UInt64', function () {

  describe('has correct constants of', function () {
    it('lower bound value', function () {
      assert.strictEqual(ChainUInt64.MinValue, 0);
    });

    it('upper bound value', function () {
      assert.strictEqual(ChainUInt64.MaxValue, 18_446_744_073_709_551_616);
    });
  });

  describe('correctly serializes to byte sequence from', function () {

    it('lower bound value', function () {
      const value = 0;
      const expected = '0000000000000000';
      assert.strictEqual(new ChainUInt64(value).bytes(), expected);
    });

    // it('upper bound value', function () {
    //   const value = 2 ** 64 - 1;
    //   const expected = 'ffffffffffffffff';
    //   assert.strictEqual(new ChainUInt64(value).bytes(), expected);
    // });

    it('any other value', function () {
      const value = 123456789012;
      const expected = '141a99be1c000000';
      assert.strictEqual(new ChainUInt64(value).bytes(), expected);
    });
  });

  describe('returns correct wrapped value on', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(new ChainUInt64(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 64 - 1;
      assert.strictEqual(new ChainUInt64(value).value(), value);
    });

    it('any other value', function () {
      const value = 123456789012;
      assert.strictEqual(new ChainUInt64(value).value(), value);
    });

  });

  describe('throws an ValidationError on value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => new ChainUInt64(value), ValidationError);
    });

    // it('greater than upper bound', function () {
    //   const value = 2 ** 64;
    //   assert.throws(() => new ChainUInt64(value), ValidationError);
    // });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('lower bound value', function () {
      const value = '0000000000000000';
      const expected = 0;
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), expected);
    });

    it('upper bound value', function () {
      const value = 'ffffffffffffffff';
      const expected = 2 ** 64 - 1;
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), expected);
    });

    it('any other value', function () {
      const value = 'b11cd81f31000000';
      const expected = 210987654321;
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of length less than 8 bytes', function () {
      const value = '123456789012345';
      assert.throws(() => ChainUInt64.fromBytes(value), ValidationError);
    });

    it('of length greater than 8 bytes', function () {
      const value = '12345678901234567';
      assert.throws(() => ChainUInt64.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = '00000000000000fg';
      assert.throws(() => ChainUInt64.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('lower bound value', function () {
      const value = 0;
      assert.strictEqual(ChainUInt64.fromValue(value).value(), value);
    });

    it('upper bound value', function () {
      const value = 2 ** 64 - 1;
      assert.strictEqual(ChainUInt64.fromValue(value).value(), value);
    });

    it('any other value', function () {
      const value = 123456789012;
      assert.strictEqual(ChainUInt64.fromValue(value).value(), value);
    });

  });

  describe('throws ValidationError on generating from value', function () {

    it('less than lower bound', function () {
      const value = -1;
      assert.throws(() => ChainUInt64.fromValue(value), ValidationError);
    });

    // it('greater than upper bound', function () {
    //   const value = 2 ** 64;
    //   assert.throws(() => ChainUInt64.fromValue(value), ValidationError);
    // });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = 'ffffffffffffffff';
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), ChainUInt64.MaxValue);
    });

    it('uppercase value', function () {
      const value = 'FFFFFFFFFFFFFFFF';
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), ChainUInt64.MaxValue);
    });

    it('mixed case value', function () {
      const value = 'fFfFfFfFfFfFfFfF';
      assert.strictEqual(ChainUInt64.fromBytes(value).value(), ChainUInt64.MaxValue);
    });

  });

});