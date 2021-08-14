import { ChainArray, ChainAsset, ChainInt64, ChainObjectId, ChainTime } from "..";
import Operation from "../Operation";

type PollVoteDelegationCreateProps = {
  /**
   * Identifier of topic where vote management right will be applicable.
   */
  topics: Array<string>,

  /**
   * Account ID of user who delegates vote management right to other user.
   */
  delegator: string,

  /**
   * Account ID of user who will recieve vote management right from other user.
   */
  delegatee: string,

  /**
   * Start date of period of when vote management right will be valid.
   */
  startDate: Date | string,

  /**
   * End date of period of when vote management right will be valid.
   */
  endDate: Date | string,
};

type PollVoteDelegationCreateChainProps = {
  topics: ChainArray<ChainObjectId>,
  delegator: ChainObjectId,
  delegatee: ChainObjectId,
  startDate: ChainTime,
  endDate: ChainTime,
};

/**
 * Delegates vote management right from one user to another.
 *
 * Transaction containing this operation should be signed by active key.
 */
export default class PollVoteDelegationCreate extends Operation<PollVoteDelegationCreateChainProps> {
  constructor(props: PollVoteDelegationCreateProps) {
    super(0x11, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      topics: ChainArray.fromValue(props.topics.map(t => ChainObjectId.fromValue(t))),
      delegator: ChainObjectId.fromValue(props.delegator),
      delegatee: ChainObjectId.fromValue(props.delegatee),
      startDate: props.startDate instanceof Date ? ChainTime.fromDate(props.startDate) : ChainTime.fromValue(props.startDate),
      endDate: props.endDate instanceof Date ? ChainTime.fromDate(props.endDate) : ChainTime.fromValue(props.endDate),
    });
  }
}