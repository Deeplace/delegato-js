import { ChainType, ISerializable, ValidationError } from ".";

/**
 * Represents primitive blockchain type.
 */
export abstract class Type<Base> implements ISerializable<Base> {

  //#region ~Fields~

  private readonly _value: Base;

  //#endregion

  //#region ~Constructor~

  constructor(value: Base) {
    this._value = value;
    if (!this.valid()) {
      throw new ValidationError("Value cannot be converted to blockchain one.");
    }
  }

  //#endregion

  //#region ~ISerializable~

  value(): Base {
    return this._value;
  }

  abstract bytes(): string;

  //#endregion

  //#region ~Methods~

  /**
   * Defines if base value of blockchain type is valid.
   *
   * @returns True if value is valid, otherwise false.
   */
  protected abstract valid(): boolean;

  //#endregion

}

/**
 * Base type of blockchain one.
 */
export type TypeBase<T extends ChainType> = T extends Type<infer B> ? B : never;