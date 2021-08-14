import { ChainType, Dictionary, ISerializable, ValidationError } from '..';
import { JsonType } from '../..';
import CaseConverter from '../../utils/CaseConverter';

/**
 * Base class for blockchain operation.
 */
export default abstract class ChainObject<Props extends Dictionary<string, ChainType>> implements ISerializable<Dictionary<string, JsonType>> {

  //#region ~Fields~

  /**
   * Blockchain object properties.
   */
  protected readonly props: Props;

  //#endregion

  //#region ~Constructor~

  /**
   * @param {Props} props Blockchain object properties.
   */
  constructor(props: Props) {
    this.props = props;
    if (!this.valid()) {
      throw new ValidationError("Value cannot be converted to blockchain one.");
    }
  }

  //#endregion

  //#region ~ISerializable~

  public value() {
    let object: Dictionary<string, JsonType> = {};
    Object.entries(this.props).forEach(([key, chainValue]) => {
      object[CaseConverter.toSnakeCaseString(key)] = chainValue.value();
    });
    return object;
  }

  public bytes() {
    return Object.keys(this.props).reduce((result, prop) => {
      return result + this.props[prop].bytes();
    }, '');
  }

  //#endregion

  //#region ~Methods~

  protected abstract valid(): boolean;

  //#endregion

}
