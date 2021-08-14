import { ChainString, ChainUInt16, ChainUInt64, PublicKey, ChainObjectId, ChainAsset, ChainInt64 } from "..";
import Operation from "../Operation";
import Optional from "../types/Optional";

type AccountUpdateProps = {
  account: string,

  /**
   * First name of user being updated.
   */
  firstName?: string,

  /**
   * Last name of user being updated.
   */
  lastName?: string,

  /**
   * New user's year of birth.
   */
  birth?: number,

  /**
   * Identification number of user being updated.
   */
  idnp?: number,

  /**
   * Locality identifier of user being updated.
   */
  locality?: string,

  /**
   * Owner public key of user being updated.
   *
   * Transaction should be self signed with this key.
   */
  owner?: PublicKey | string,

  /**
   * Active public key of user being updated.
   *
   * Transaction should be self signed with this key.
   */
  active?: PublicKey | string,
};

type AccountUpdateChainProps = {
  account: ChainObjectId,
  firstName: Optional<ChainString>,
  lastName: Optional<ChainString>,
  birth: Optional<ChainUInt16>,
  idnp: Optional<ChainUInt64>,
  locality: Optional<ChainObjectId>,
  owner: Optional<PublicKey>,
  active: Optional<PublicKey>,
};

/**
 * Updates information about existing account.
 *
 * Transaction containing this operation should be signed by owner key.
 */
export default class AccountUpdate extends Operation<AccountUpdateChainProps> {
  constructor(props: AccountUpdateProps) {
    super(0x01, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      account: ChainObjectId.fromValue(props.account),
      firstName: Optional.fromValue<ChainString>(props.firstName === undefined ? null : ChainString.fromValue(props.firstName)),
      lastName: Optional.fromValue<ChainString>(props.lastName === undefined ? null : ChainString.fromValue(props.lastName)),
      birth: Optional.fromValue<ChainUInt16>(props.birth === undefined ? null : ChainUInt16.fromValue(props.birth)),
      idnp: Optional.fromValue<ChainUInt64>(props.idnp === undefined ? null : ChainUInt64.fromValue(props.idnp)),
      locality: Optional.fromValue<ChainObjectId>(props.locality === undefined ? null : ChainObjectId.fromValue(props.locality)),
      owner: Optional.fromValue<PublicKey>(props.owner === undefined ? null : props.owner instanceof PublicKey ? props.owner : PublicKey.fromWif(props.owner)),
      active: Optional.fromValue<PublicKey>(props.active === undefined ? null : props.active instanceof PublicKey ? props.active : PublicKey.fromWif(props.active)),
    });
  }
}