import { ChainAsset, ChainInt64, ChainObjectId } from "..";
import Operation from "../Operation";

type PollVoteDelegationWithdrawProps = {
  /**
   * Identifier of delegation object to be withdrawn.
   */
  delegation: string,

  /**
   * Account ID of user who delegated vote management right before.
   */
  delegator: string,
};

type PollVoteDelegationWithdrawChainProps = {
  delegation: ChainObjectId,
  delegator: ChainObjectId,
};

/**
 * Withdraws vote management right delegated from one user to another before.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVoteDelegationWithdraw extends Operation<PollVoteDelegationWithdrawChainProps> {
  constructor(props: PollVoteDelegationWithdrawProps) {
    super(0x12, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      delegation: ChainObjectId.fromValue(props.delegation),
      delegator: ChainObjectId.fromValue(props.delegator),
    });
  }
}