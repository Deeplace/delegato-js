import { ChainArray, ChainTime, ChainType, ChainUInt16, ChainUInt32, Dictionary, ISerializable, LogicError, Operation, PrivateKey, Signature } from ".";
import { Api, JsonType } from "..";

/**
 * Represents blockchain transaction.
 */
export default class Transaction implements ISerializable<Dictionary<string, JsonType>> {

  //#region ~Fields~

  /**
   * Defines if transaction is already signed.
   */
  private signed: boolean;

  /**
   * Blockchain API client to broadcast transaction.
   */
  private api: Api;

  private refBlockNum: ChainUInt16;
  private refBlockPrefix: ChainUInt32;
  private expiration: ChainTime;
  private operations: ChainArray<ChainType>;
  private extensions: ChainArray<never>;
  private signatures: ChainArray<Signature>;

  //#endregion

  //#region ~Constructor~

  constructor(api: Api, refBlockNum: number, refBlockPrefix: string, expiration: Date | string, operations: Array<Operation>) {
    this.api = api;

    this.refBlockNum = new ChainUInt16(refBlockNum);
    this.refBlockPrefix = ChainUInt32.fromBytes(refBlockPrefix);
    this.expiration = new ChainTime(expiration);
    this.operations = new ChainArray(operations);
    this.extensions = new ChainArray([]);
    this.signatures = new ChainArray([]);

    this.signed = false;
  }

  //#endregion

  //#region ~ISerializable~

  value(): Dictionary<string, JsonType> {
    let object: Dictionary<string, JsonType> = {
      ref_block_num: this.refBlockNum.value(),
      ref_block_prefix: this.refBlockPrefix.value(),
      expiration: this.expiration.value(),
      operations: this.operations.value(),
      extensions: this.extensions.value(),
      signatures: this.signatures.value(),
    };
    return object;
  }

  bytes(): string {
    return [
      this.refBlockNum,
      this.refBlockPrefix,
      this.expiration,
      this.operations,
      this.extensions
    ].reduce((result, value) => result + value.bytes(), '');
  }

  //#endregion

  /**
   * Appends this transaction with signatures for each specified key.
   *
   * @param keys Keys to create signatures.
   *
   * @returns This transaction.
   */
  sign(keys: Array<PrivateKey>): Transaction {
    if (this.signed) {
      throw new LogicError('Transaction has been signed before.');
    }
    let bytes = this.api.chainId + this.bytes();
    this.signatures = new ChainArray(keys.map(k => new Signature(bytes, k)));
    this.signed = true;
    return this;
  }

  /**
   * Transmits signed transaction to blockchain.
   *
   * @returns Blockchain API result.
   */
  async broadcast() {
    if (!this.signed) {
      throw new LogicError('Transaction has not been signed.');
    }
    return this.api.network.broadcastTransactionSynchronous(this);
  }
}
