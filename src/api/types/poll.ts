import { Dictionary, Language } from "../../chain";
import { JsonType } from "../../jsonrpc";

export type PollPreview = {
  id: string,
  account: string,
  title: string,
  topic: string,
  endDate: string,
  content: string,
  locality: string,
  votes: number,
  voted: string | null,
};

export type Poll = PollPreview & {
  locality: string,
  variants: Array<PollVariant>,
};

export type PollVariant = {
  id: string,
  content: string,
  voted: boolean,
  votes: number,
};

export type Topic = {
  id: string,
  name: Array<[Language, string]>,
};

export type Locality = {
  id: string,
  name: Array<[Language, string]>,
};

export type PollVoteDelegationIncoming = {
  id: string,
  delegator: string,
  startDate: string,
  endDate: string,
  topic: string,
  isAccepted: boolean,
};

export type PollVoteDelegationOutgoing = {
  id: string,
  delegatee: string,
  startDate: string,
  endDate: string,
  topic: string,
};

export type List<T extends JsonType> = {
  items: Array<T>,
  length: number,
};

export type PollAccount = {
  id: string,
  name: string,
  age: number,
  locality: string,
  photo: string,
};

export type PollVoteDelegationAvailability = {
  unavailableTopics: Array<string>,
  delegationsToBeLost: number,
};
