import { ChainArray, ChainMap, ChainObjectId, ChainString, ChainTime, ChainUInt32, ChainUInt8, Language, ValidationError, ChainBoolean, ChainAsset, ChainInt64 } from "..";
import Operation from "../Operation";
import { IncompleteDictionary } from "../types";
import ChainObject from "../types/Object";

type PollVariantProps = {
  /**
   * Text of answer for new poll in multiple languages.
   */
  content: IncompleteDictionary<Language, string>,

  /**
   * The priority for displaying the answer.
   *
   * Answers with lower weight will be displayed above.
   */
  weight: number,
};

type PollVariantChainProps = {
  content: ChainMap<ChainUInt8, ChainString>,
  weight: ChainUInt32
};

type PollCreateProps = {
  /**
   * Account ID of user who creates new poll.
   */
  account: string,

  /**
   * Titles of new poll in multiple languages.
   */
  title: IncompleteDictionary<Language, string>,

  /**
   * Identifier of topic of new poll to be created.
   */
  topic: string,

  /**
   * Start date of period when new poll will be active.
   */
  startDate: Date | string,

  /**
   * End date of period when new poll will be active.
   */
  endDate: Date | string,

  /**
   * Description of new poll in multiple languages.
   */
  content: IncompleteDictionary<Language, string>,

  /**
   * List of possible answers of new poll to be created.
   */
  variants: Array<PollVariantProps>,

  /**
   * Defines if vote delegation will be allowed in the poll to be created.
   */
  delegationAllowed: boolean,

  /**
   * Defines if M-Sign will be required in the poll to be created.
   */
  signRequired: boolean,
};

type PollCreateChainProps = {
  account: ChainObjectId,
  title: ChainMap<ChainUInt8, ChainString>,
  topic: ChainObjectId,
  startDate: ChainTime,
  endDate: ChainTime,
  content: ChainMap<ChainUInt8, ChainString>,
  variants: ChainArray<PollVariant>,
  delegationAllowed: ChainBoolean,
  signRequired: ChainBoolean,
};

/**
 * Creates new poll.
 *
 * Transaction containing this operation should be signed by owner key.
 */
export class PollVariant extends ChainObject<PollVariantChainProps> {
  constructor(props: PollVariantProps) {
    super({
      content: ChainMap.fromValue(new Map<ChainUInt8, ChainString>(Object.entries(props.content).filter(([k, v]) => typeof v !== 'undefined').map(([k, v]) => [ChainUInt8.fromValue(parseInt(k)), ChainString.fromValue(v as string)]))),
      weight: ChainUInt32.fromValue(props.weight),
    });
  }

  valid(): boolean {
    if (this.props.content.value().length == 0) {
      throw new ValidationError('Content cannot be empty.');
    }
    if (!Array.from(this.props.content.value().keys()).every(k => k in Language)) {
      throw new ValidationError('Key value is out of range of language.');
    }
    return true;
  }
}

/**
 * Creates new poll in blockchain.
 *
 * Transaction containing this operation should be signed with owner key.
 */
export default class PollCreate extends Operation<PollCreateChainProps> {
  constructor(props: PollCreateProps) {
    super(0x0F, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      account: ChainObjectId.fromValue(props.account),
      title: ChainMap.fromValue(new Map<ChainUInt8, ChainString>(Object.entries(props.title).filter(([k, v]) => typeof v !== 'undefined').map(([k, v]) => [ChainUInt8.fromValue(parseInt(k)), ChainString.fromValue(v as string)]))),
      topic: ChainObjectId.fromValue(props.topic),
      startDate: props.startDate instanceof Date ? ChainTime.fromDate(props.startDate) : ChainTime.fromValue(props.startDate),
      endDate: props.endDate instanceof Date ? ChainTime.fromDate(props.endDate) : ChainTime.fromValue(props.endDate),
      content: ChainMap.fromValue(new Map<ChainUInt8, ChainString>(Object.entries(props.content).filter(([k, v]) => typeof v !== 'undefined').map(([k, v]) => [ChainUInt8.fromValue(parseInt(k)), ChainString.fromValue(v as string)]))),
      variants: ChainArray.fromValue(props.variants.map(v => new PollVariant(v))),
      delegationAllowed: ChainBoolean.fromValue(props.delegationAllowed),
      signRequired: ChainBoolean.fromValue(props.signRequired),
    });
  }
}
