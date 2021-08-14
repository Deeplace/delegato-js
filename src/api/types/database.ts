import { PublicKey, Transaction } from "../../chain";

export type DynamicGlobalProperty = {
  id: string,
  headBlockNumber: number,
  headBlockId: string,
  time: string,
  currentWitness: string,
  nextMaintenanceTime: string,
  lastVoteTallyTime: string,
  lastBudgetTime: string,
  witnessBudget: number,
  totalPob: number,
  totalInactive: number,
  accountsRegisteredThisInterval: number,
  recentlyMissedCount: number,
  currentAslot: number,
  recentSlotsFilled: string,
  dynamicFlags: number,
  lastIrreversibleBlockNum: number,
};

export type Block = {
  previous: string,
  timestamp: string,
  witness: string,
  transactionMerkleRoot: string,
  extensions: Array<{}>,
  witnessSignature: string,
  transactions: Array<Transaction>,
};

export type Account = {
  id: string,
  registrar: string,
  referrer: string,
  networkFeePercentage: number,
  lifetimeReferrerFeePercentage: number,
  referrerRewardsPercentage: number,
  email: string,
  firstName: string,
  lastName: string,
  birth: number,
  idnp: number,
  locality: string,
  owner: ReturnType<PublicKey['value']>,
  active: ReturnType<PublicKey['value']>,
  numCommitteeVoted: number,
  statistics: string,
  votes: string,
  ownerSpecialAuthority: [ 0, {} ],
  activeSpecialAuthority: [ 0, {} ],
  topN_controlFlags: 0,
};

export type GlobalProperty = {
  id: string,
  chainId: string,
  immutableParameters: {
    minCommitteeMemberCount: number,
    minWitnessCount: number,
    numSpecialAccounts: number,
    numSpecialAssets: number,
  },
};