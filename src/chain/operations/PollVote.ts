import { ChainAsset, ChainInt64, ChainObjectId } from "..";
import Operation from "../Operation";

type PollVoteProps = {
  /**
   * Account ID of user who creates the vote.
   */
  account: string,

  /**
   * Identifier of answer selected by user.
   */
  variant: string,
};

type PollVoteChainProps = {
  account: ChainObjectId,
  variant: ChainObjectId,
};

/**
 * Votes for the answer option in the poll.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVote extends Operation<PollVoteChainProps> {
  constructor(props: PollVoteProps) {
    super(0x10, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      account: ChainObjectId.fromValue(props.account),
      variant: ChainObjectId.fromValue(props.variant),
    });
  }
}