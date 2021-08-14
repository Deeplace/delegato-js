import assert from 'assert';
import { ValidationError } from '../../error';
import ChainString from '../String';

describe('String', function () {
  const emptyValue = '';
  const russianValue = 'Съешь же ещё этих мягких французских булок да выпей чаю.';
  const romanianValue = 'Gheorghe, obezul, a reuşit să obţină jucându-se un flux în Quebec de o mie kilowaţioră.';
  const englishValue = 'The quick brown fox jumps over the lazy dog.';
  const emptyBytes = '00';
  const russianBytes = '66d0a1d18ad0b5d188d18c20d0b6d0b520d0b5d189d19120d18dd182d0b8d18520d0bcd18fd0b3d0bad0b8d18520d184d180d0b0d0bdd186d183d0b7d181d0bad0b8d18520d0b1d183d0bbd0bed0ba20d0b4d0b020d0b2d18bd0bfd0b5d0b920d187d0b0d18e2e';
  const romanianBytes = '5f4768656f726768652c206f62657a756c2c206120726575c59f69742073c483206f62c5a3696ec483206a7563c3a26e64752d736520756e20666c757820c3ae6e20517565626563206465206f206d6965206b696c6f7761c5a3696f72c4832e';
  const englishBytes = '2c54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f672e';

  describe('correctly serializes to byte sequence from', function () {

    it('empty string', function () {
      assert.strictEqual(new ChainString(emptyValue).bytes(), emptyBytes);
    });

    it('non empty russian string', function () {
      assert.strictEqual(new ChainString(russianValue).bytes(), russianBytes);
    });

    it('non empty romanian string', function () {
      assert.strictEqual(new ChainString(romanianValue).bytes(), romanianBytes);
    });

    it('non empty english string', function () {
      assert.strictEqual(new ChainString(englishValue).bytes(), englishBytes);
    });

  });

  describe('returns correct wrapped value on', function () {

    it('empty string', function () {
      assert.strictEqual(new ChainString(emptyValue).value(), emptyValue);
    });

    it('non empty russian string', function () {
      assert.strictEqual(new ChainString(russianValue).value(), russianValue);
    });

    it('non empty romanian string', function () {
      assert.strictEqual(new ChainString(romanianValue).value(), romanianValue);
    });

    it('non empty english string', function () {
      assert.strictEqual(new ChainString(englishValue).value(), englishValue);
    });

  });

  describe('generates correct instance from byte sequence of', function () {

    it('empty string', function () {
      assert.strictEqual(ChainString.fromBytes(emptyBytes).value(), emptyValue);
    });

    it('non empty russian string', function () {
      assert.strictEqual(ChainString.fromBytes(russianBytes).value(), russianValue);
    });

    it('non empty romanian string', function () {
      assert.strictEqual(ChainString.fromBytes(romanianBytes).value(), romanianValue);
    });

    it('non empty english string', function () {
      assert.strictEqual(ChainString.fromBytes(englishBytes).value(), englishValue);
    });

  });

  describe('throws ValidationError on generating from byte sequence', function () {

    it('of odd length', function () {
      const value = '1234567';
      assert.throws(() => ChainString.fromBytes(value), ValidationError);
    });

    it('with invalid characters', function () {
      const value = '0d48656c6c6g2c20776f726c6421';
      assert.throws(() => ChainString.fromBytes(value), ValidationError);
    });

  });

  describe('generates correct instance from', function () {

    it('empty string', function () {
      assert.strictEqual(ChainString.fromValue(emptyValue).value(), emptyValue);
    });

    it('non empty russian string', function () {
      assert.strictEqual(ChainString.fromValue(russianValue).value(), russianValue);
    });

    it('non empty romanian string', function () {
      assert.strictEqual(ChainString.fromValue(romanianValue).value(), romanianValue);
    });

    it('non empty english string', function () {
      assert.strictEqual(ChainString.fromValue(englishValue).value(), englishValue);
    });

  });

  describe('byte sequence is case insensitive on', function () {

    it('lowercase value', function () {
      const value = '0d48656c6c6f2c20776f726c6421';
      const expected = 'Hello, world!';
      assert.strictEqual(ChainString.fromBytes(value).value(), expected);
    });

    it('uppercase value', function () {
      const value = '0D48656C6C6F2C20776F726C6421';
      const expected = 'Hello, world!';
      assert.strictEqual(ChainString.fromBytes(value).value(), expected);
    });

    it('mixed case value', function () {
      const value = '0D48656C6c6F2c20776f726C6421';
      const expected = 'Hello, world!';
      assert.strictEqual(ChainString.fromBytes(value).value(), expected);
    });

  });

});