import { ChainAsset, ChainInt64, ChainObjectId } from "..";
import Operation from "../Operation";

type PollVoteDelegationRejectProps = {
  /**
   * Identifier of delegation object to be rejected.
   */
  delegation: string,

  /**
   * Account ID of user who will recieved vote management right from other user.
   */
  delegatee: string,
};

type PollVoteDelegationRejectChainProps = {
  delegation: ChainObjectId,
  delegatee: ChainObjectId,
};

/**
 * Rejects vote management right from delegated by user before.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVoteDelegationReject extends Operation<PollVoteDelegationRejectChainProps> {
  constructor(props: PollVoteDelegationRejectProps) {
    super(0x15, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      delegation: ChainObjectId.fromValue(props.delegation),
      delegatee: ChainObjectId.fromValue(props.delegatee),
    });
  }
}