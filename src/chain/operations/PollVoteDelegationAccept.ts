import { ChainAsset, ChainInt64, ChainObjectId } from "..";
import Operation from "../Operation";

type PollVoteDelegationAcceptProps = {
  /**
   * Identifier of delegation object to be accepted.
   */
  delegation: string,

  /**
   * Account ID of user who will recieved vote management right from other user.
   */
  delegatee: string,
};

type PollVoteDelegationAcceptChainProps = {
  delegation: ChainObjectId,
  delegatee: ChainObjectId,
};

/**
 * Accepts vote management right delegation from other user.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVoteDelegationAccept extends Operation<PollVoteDelegationAcceptChainProps> {
  constructor(props: PollVoteDelegationAcceptProps) {
    super(0x13, {
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