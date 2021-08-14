import { ChainFixedBytes, ChainString, ChainUInt16, ChainUInt64, PublicKey, ChainObjectId, ChainAsset, ChainInt64 } from "..";
import Operation from "../Operation";

type AccountCreateProps = {
  /**
   * First name of new user.
   */
  firstName: string,

  /**
   * Last name of new user.
   */
  lastName: string,

  /**
   * New user's year of birth.
   */
  birth: number,

  /**
   * Identification number of new user.
   */
  idnp: number,

  /**
   * E-mail (also will be used as login) of new user.
   */
  email: string,

  /**
   * Blockchain identifier of new user's locality.
   */
  locality: string,

  /**
   * Secret question of new user. This value will be used to restore forgotten password.
   */
  secretQuestion: string,

  /**
   * Answer to secret question. Represents value hashed by SHA-256 algorithm.
   *
   * All special charaters and spaces should be deleted from the value before the hashing.
   */
  secretAnswer: string,

  /**
   * Owner public key of new user.
   *
   * Transaction should be self signed with this key.
   */
  owner: PublicKey | string,

  /**
   * Active public key of new user.
   *
   * Transaction should be self signed with this key.
   */
  active: PublicKey | string,
};

type AccountCreateChainProps = {
  firstName: ChainString,
  lastName: ChainString,
  birth: ChainUInt16,
  idnp: ChainUInt64,
  email: ChainString,
  locality: ChainObjectId,
  secretQuestion: ChainString,
  secretAnswer: ChainFixedBytes<32>,
  owner: PublicKey,
  active: PublicKey,
};

/**
 * Creates new user in blockchain.
 *
 * Transaction containing this operation should be signed by both active and owner keys specified in this operation.
 */
export default class AccountCreate extends Operation<AccountCreateChainProps> {
  constructor(props: AccountCreateProps) {
    super(0x00, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      firstName: ChainString.fromValue(props.firstName),
      lastName: ChainString.fromValue(props.lastName),
      birth: ChainUInt16.fromValue(props.birth),
      idnp: ChainUInt64.fromValue(props.idnp),
      email: ChainString.fromValue(props.email),
      locality: ChainObjectId.fromValue(props.locality),
      secretQuestion: ChainString.fromValue(props.secretQuestion),
      secretAnswer: ChainFixedBytes.fromValue(props.secretAnswer) as ChainFixedBytes<32>,
      owner: props.owner instanceof PublicKey ? props.owner : PublicKey.fromWif(props.owner),
      active: props.active instanceof PublicKey ? props.active : PublicKey.fromWif(props.active),
    });
  }
}