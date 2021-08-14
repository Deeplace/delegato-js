import { ChainObjectId, ChainInt64 } from "..";
import ChainObject from "./Object";

export type ChainAssetProps = {
  amount: ChainInt64,
  assetId: ChainObjectId
};

/**
 * Represents serializable chain object of asset.
 */
export default class ChainAsset extends ChainObject<ChainAssetProps> {

  /**
   * @inheritdoc
   */
  valid(): boolean {
    return true;
  }

  //#region ~Static methods~

  // /**
  //  * Creates instance of ChainUInt64 object using its byte representation.
  //  *
  //  * @param {string} bytes Bytes to create instance of ChainUInt64 object.
  //  *
  //  * @returns {ChainUInt64} New instance of ChainUInt64 object.
  //  */
  //  static fromBytes(bytes: string): ChainUInt64 {
  //   assertBytes(bytes, 8);
  //   let bb = ByteBuffer.fromHex(bytes, true);
  //   return ChainUInt64.fromValue(bb.readUint64(0).toNumber());
  // }

  // /**
  //  * Creates instance of ChainUInt64 object using its value.
  //  *
  //  * @param {number} value Value to create instance of ChainUInt64 object.
  //  *
  //  * @returns {ChainUInt64} New instance of ChainUInt64 object.
  //  */
  // static fromValue(value: number): ChainUInt64 {
  //   return new ChainUInt64(value);
  // }

  //#endregion

}