type GenuineObject = { [key: string]: AnyObject };

type AnyObject = string | number | boolean | null | GenuineObject | Array<AnyObject>;

/**
 * Utility to convert camel case string to snake case one and vice versa.
 */
export default class CaseConverter {

  /**
   * Converts snake case string to camel case one.
   *
   * @param {string} snakeCaseString Snake case string being converted.
   *
   * @returns {string} Camel case string.
   */
  public static toCamelCaseString(snakeCaseString: string): string {
    return snakeCaseString.replace(/[a-z0-9]_[a-z]/g, letter => `${letter[0]}${letter[2].toUpperCase()}`);
  }

  /**
   * Converts camel case string to snake case one.
   *
   * @param {string} camelCaseString Camel case string being converted.
   *
   * @returns {string} Snake case string.
   */
  public static toSnakeCaseString(camelCaseString: string): string {
    return camelCaseString.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Converts snake case keys of object to camel case strings.
   *
   * @param {AnyObject} snakeCase Object which snake case keys being converted.
   *
   * @returns {AnyObject} Object with camel case keys.
   */
  public static toCamelCase(snakeCase: AnyObject): AnyObject {
    switch (typeof snakeCase) {
      case 'string':
      case 'number':
      case 'boolean':
        return snakeCase;

      default:
        if (snakeCase === null) {
          return null;
        }
        else if (Array.isArray(snakeCase)) {
          return snakeCase.map(o => CaseConverter.toCamelCase(o));
        }
        else if (typeof snakeCase == 'object') {
          let result: GenuineObject = {};
          Object.entries(snakeCase).forEach(([key, value]) => {
            result[CaseConverter.toCamelCaseString(key)] = CaseConverter.toCamelCase(value);
          });
          return result;
        }
        throw new Error();
    }
  }

  /**
   * Converts camel case keys of object to snake case strings.
   *
   * @param {AnyObject} camelCase Object which camel case keys being converted.
   *
   * @returns {AnyObject} Object with snake case keys.
   */
  public static toSnakeCase(camelCase: AnyObject): AnyObject {
    switch (typeof camelCase) {
      case 'string':
      case 'number':
      case 'boolean':
        return camelCase;

      default:
        if (camelCase === null) {
          return null;
        }
        else if (Array.isArray(camelCase)) {
          return camelCase.map(o => CaseConverter.toSnakeCase(o));
        }
        else if (typeof camelCase == 'object') {
          let result: GenuineObject = {};
          Object.entries(camelCase).forEach(([key, value]) => {
            result[CaseConverter.toSnakeCaseString(key)] = CaseConverter.toSnakeCase(value);
          });
          return result;
        }
        throw new Error();
    }
  }

}