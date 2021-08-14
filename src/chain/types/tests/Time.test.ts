import assert from 'assert';
import { ValidationError } from '../../error';
import ChainTime from '../Time';

describe('Time', function () {

  describe('correctly serializes to byte sequence from', function () {

    it('iso string', function () {
      const value = '1997-03-27T05:00:00';
      const expected = 'd0fe3933';
      assert.strictEqual(new ChainTime(value).bytes(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00Z';
      const expected = 'd0fe3933';
      assert.strictEqual(new ChainTime(value).bytes(), expected);
    });

    it('iso string with milliseconds', function () {
      const value = '1997-03-27T05:00:00.123';
      const expected = 'd0fe3933';
      assert.strictEqual(new ChainTime(value).bytes(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00.123Z';
      const expected = 'd0fe3933';
      assert.strictEqual(new ChainTime(value).bytes(), expected);
    });

    it('date object', function () {
      const value = new Date(859438800000);
      const expected = 'd0fe3933';
      assert.strictEqual(new ChainTime(value).bytes(), expected);
    });

  });

  describe('returns correct wrapped value on', function () {

    it('iso string', function () {
      const value = '1997-03-27T05:00:00';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(new ChainTime(value).value(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00Z';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(new ChainTime(value).value(), expected);
    });

    it('iso string with milliseconds', function () {
      const value = '1997-03-27T05:00:00.123';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(new ChainTime(value).value(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00.123Z';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(new ChainTime(value).value(), expected);
    });

    it('date object', function () {
      const value = new Date(859438800000);
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(new ChainTime(value).value(), expected);
    });

  });

  describe('throws an ValidationError on', function () {

    it('empty string', function () {
      const value = '';
      assert.throws(() => new ChainTime(value), ValidationError);
    });

    it('iso string with timezone', function () {
      const value = '1997-03-27T05:00:00+02:00';
      assert.throws(() => new ChainTime(value), ValidationError);
    });

    it('gmt string', function () {
      const value = 'Thu, 24 Mar 1997 05:00:00 GMT';
      assert.throws(() => new ChainTime(value), ValidationError);
    });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('lower bound value', function () {
      const value = '00000000';
      const expected = '1970-01-01T00:00:00';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

    it('upper bound value', function () {
      const value = 'ffffffff';
      const expected = '2106-02-07T06:28:15';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

    it('any other value', function () {
      const value = 'd0fe3933';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of length less than 4 bytes', function () {
      const value = '1234567';
      assert.throws(() => ChainTime.fromBytes(value), ValidationError);
    });

    it('of length greater than 4 bytes', function () {
      const value = '123456789';
      assert.throws(() => ChainTime.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = '000000fg';
      assert.throws(() => ChainTime.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('iso string', function () {
      const value = '1997-03-27T05:00:00';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromValue(value).value(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00Z';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromValue(value).value(), expected);
    });

    it('iso string with milliseconds', function () {
      const value = '1997-03-27T05:00:00.123';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromValue(value).value(), expected);
    });

    it('iso string with Z', function () {
      const value = '1997-03-27T05:00:00.123Z';
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromValue(value).value(), expected);
    });

    it('date object', function () {
      const value = new Date(859438800000);
      const expected = '1997-03-27T05:00:00';
      assert.strictEqual(ChainTime.fromDate(value).value(), expected);
    });

  });

  describe('throws ValidationError on generating from value', function () {

    it('empty string', function () {
      const value = '';
      assert.throws(() => ChainTime.fromValue(value), ValidationError);
    });

    it('iso string with timezone', function () {
      const value = '1997-03-27T05:00:00+02:00';
      assert.throws(() => ChainTime.fromValue(value), ValidationError);
    });

    it('gmt string', function () {
      const value = 'Thu, 24 Mar 1997 05:00:00 GMT';
      assert.throws(() => ChainTime.fromValue(value), ValidationError);
    });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = 'ffffffff';
      const expected = '2106-02-07T06:28:15';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

    it('uppercase value', function () {
      const value = 'FFFFFFFF';
      const expected = '2106-02-07T06:28:15';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

    it('mixed case value', function () {
      const value = 'fFfFfFfF';
      const expected = '2106-02-07T06:28:15';
      assert.strictEqual(ChainTime.fromBytes(value).value(), expected);
    });

  });

});