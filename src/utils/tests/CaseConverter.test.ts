import assert from 'assert';
import CaseConverter from '../CaseConverter';

describe('CaseUtil', function () {

  describe('correctly transforms string', function () {
    const camelCase1 = 'testStringTestString1';
    const snakeCase1 = 'test_string_test_string1';
    const camelCase2 = '_testStringTest1String';
    const snakeCase2 = '_test_string_test1_string';
    const camelCase3 = 'testStringTestString_';
    const snakeCase3 = 'test_string_test_string_';

    it('from snake case to camel case', function () {
      assert.strictEqual(CaseConverter.toCamelCaseString(snakeCase1), camelCase1);
      assert.strictEqual(CaseConverter.toCamelCaseString(snakeCase2), camelCase2);
      assert.strictEqual(CaseConverter.toCamelCaseString(snakeCase3), camelCase3);
    });

    it('from camel case to snake case', function () {
      assert.strictEqual(CaseConverter.toSnakeCaseString(camelCase1), snakeCase1);
      assert.strictEqual(CaseConverter.toSnakeCaseString(camelCase2), snakeCase2);
      assert.strictEqual(CaseConverter.toSnakeCaseString(camelCase3), snakeCase3);
    });

  });

  describe('correctly transforms object', function () {
    const camelCase = {
      testPropertyTestProperty1: 1,
      _testPropertyTestProperty2: 2,
      testPropertyTestProperty3_: [{testProp: 1}, 4],
      testPropertyTestProperty4: {
        testPropertyTestProperty1: 5,
        _testPropertyTest2Property: 6,
        testPropertyTestProperty3_: 7,
      },
    };
    const snakeCase = {
      test_property_test_property1: 1,
      _test_property_test_property2: 2,
      test_property_test_property3_: [{test_prop: 1}, 4],
      test_property_test_property4: {
        test_property_test_property1: 5,
        _test_property_test2_property: 6,
        test_property_test_property3_: 7,
      },
    };

    it('from snake case to camel case', function () {
      assert.deepStrictEqual(CaseConverter.toCamelCase(snakeCase), camelCase);
    });

    it('from camel case to snake case', function () {
      assert.deepStrictEqual(CaseConverter.toSnakeCase(camelCase), snakeCase);
    });

  });

});