import { ChainAsset, ChainInt64, ChainObjectId } from "..";
import Operation from "../Operation";

type PollVoteDelegationAcceptAllProps = {
  /**
   * Account ID of user who will recieved vote management rights from other users.
   */
  delegatee: string,
};

type PollVoteDelegationAcceptAllChainProps = {
  delegatee: ChainObjectId,
};

/**
 * Accepts all vote management right delegations from other users.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVoteDelegationAcceptAll extends Operation<PollVoteDelegationAcceptAllChainProps> {
  constructor(props: PollVoteDelegationAcceptAllProps) {
    super(0x14, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      delegatee: ChainObjectId.fromValue(props.delegatee),
    });
  }
}