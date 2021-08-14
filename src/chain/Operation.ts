import { ChainType, Dictionary, ISerializable } from '.';
import { JsonType } from '..';
import CaseConverter from '../utils/CaseConverter';
import { ChainObjectId } from './types';
import ChainAsset, { ChainAssetProps } from './types/Asset';

type FeeProps = {
  fee: ChainAsset,
  feePayingAccount: ChainObjectId,
};

/**
 * Base class for blockchain operation.
 */
export default class Operation<Props extends Dictionary<string, ChainType>> implements ISerializable<[number, Dictionary<string, JsonType>]> {

  //#region ~Fields~

  /**
   * Operation properties.
   */
  protected readonly props: Props;

  /**
   * Operation fee properties.
   */
  protected readonly feeProps: FeeProps;

  /**
   * Blockchain identifier of operation.
   */
  protected readonly number: number;

  //#endregion

  //#region ~Constructor~

  /**
   * @param {number} number Blockchain identifier of operation.
   * @param {FeeProps} feeProps Operation fee properties.
   * @param {Props} props Operation properties.
   */
  constructor(number: number, feeProps: FeeProps, props: Props) {
    // Store fee parameters as chain object.
    // Just serialize this object to bytes.
    this.feeProps = feeProps;
    this.props = props;
    this.number = number;
  }

  //#endregion

  //#region ~ISerializable~

  public value() {
    let object: Dictionary<string, JsonType> = {
      fee: this.feeProps.fee.value(),
    };
    Object.entries(this.props).forEach(([key, chainValue]) => {
      object[CaseConverter.toSnakeCaseString(key)] = chainValue.value();
    });
    return [this.number, object] as [number, Dictionary<string, JsonType>];
  }

  public bytes() {
    return Object.keys(this.props).reduce((result, prop) => {
      return result + this.props[prop].bytes();
    }, `${this.number.toString(16).padStart(2, '0')}${this.feeProps.fee.bytes()}`);
  }

  //#endregion

}
