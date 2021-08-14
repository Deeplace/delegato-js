import { ApiNamespace, DisconnectEvent, JsonRpcWebSocket, JsonType } from "..";
import { ChainTime, Dictionary, Language, LogicError, Operation, PrivateKey, PrivateKeyType, Transaction } from "../chain";
import Token from "../chain/jwt/Token";
import CaseConverter from "../utils/CaseConverter";
import { MemoryStorage, Storage } from "./storage";
import { Account, Block, DynamicGlobalProperty, GlobalProperty } from "./types/database";
import { List, Locality, Poll, PollAccount, PollPreview, PollVoteDelegationAvailability, PollVoteDelegationIncoming, PollVoteDelegationOutgoing, Topic } from "./types/poll";

/**
 * Web socket client for Delegato blockchain API.
 */
export default class Api {

  //#region ~Fields~

  /**
   * Address of blockchain API node.
   */
  private _address = 'ws://127.0.0.1:8091';

  /**
   * Identifier of chain.
   */
  private _chainId = '74b66242d0ac8c5c447d04ae10460002fb5ee9c5013dd0d46a7296e259ae95a8';

  /**
   * Storage which contains authentication information.
   */
  private _storage: Storage;

  /**
   * JSON-RPC 2.0 web socket client.
   */
  protected socket: JsonRpcWebSocket;

  //#endregion

  //#region ~Properties~

  /**
   * Address of blockchain API node.
   *
   * Web socket will be disconnected if it is connected to blockchain API node on this property set.
   */
  public get address() {
    return this._address;
  }

  public set address(value: string) {
    if (this._address != value && this.socket.isConnected) {
      this.disconnect();
      this.connect();
    }
    this._address = value;
  }

  /**
   * Identifier of chain.
   *
   * This value is using for transaction signification.
   */
  public get chainId() {
    return this._chainId;
  }

  public set chainId(value: string) {
    this._chainId = value;
  }

  /**
   * Storage which contains authentication information.
   */
  public get storage(): Storage {
    return this._storage;
  }

  //#endregion

  //#region ~Constructor~

  constructor(storage?: Storage) {
    this.socket = new JsonRpcWebSocket();
    this.onDisconnect = this.socket.onDisconnect;
    this._storage = storage ?? new MemoryStorage();
  }

  //#endregion

  //#region ~Public methods~

  /**
   * Connects web socket to blockchain API node.
   */
  public connect() {
    return this.socket.connect(this.address);
  }

  /**
   * Disconnects web socket from blockchain API node.
   */
  public disconnect() {
    this.socket.disconnect();
  }

  /**
   * Creates new blockchain transaction.
   *
   * @param operations Operations to be added in transaction.
   *
   * @returns New blockchain transaction with automacticaly filled fields.
   */
  public async transaction(operations: Array<Operation>) {
    let dgp = await this.database.getDynamicGlobalProperties() as {
      headBlockNumber: number,
      headBlockId: string,
    };
    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 10);

    return new Transaction(
      this,
      dgp['headBlockNumber'],
      dgp['headBlockId'].slice(8, 16),
      expiration,
      operations
    );
  }

  public async authenticate(email: string, password: string) {
    if (this.isAuthenticated) {
      throw new LogicError('Client has already authenticated. Unauthenticate first.');
    }
    const active = PrivateKey.create(email, password, PrivateKeyType.active);
    this._storage.activePrivateKey = active;
    const token = new Token(active, email, email);
    this._storage.token = token;
    return this.login.login(token.base64());
  }

  public get isAuthenticated() {
    if (this._storage.token === null) {
      return false;
    }
    return !this._storage.token.isExpired;
  }

  //#endregion

  //#region ~Private methods~

  /**
   * Makes remote procedure call to blockchain API.
   *
   * @param {string} namespace Name of plugin whick handles method.
   * @param {string} method Method name of plugin to be called.
   * @param {Array<JsonType>} params Parameters to be passed to method.
   */
  private async call<T extends JsonType | void>(namespace: ApiNamespace, method: string, params: Array<JsonType>): Promise<T> {
    let result = await (this.socket.call('call', [namespace, method, params]) as Promise<T>);
    if (result !== {} && result !== undefined && result !== null) {
      // Inspite of the fact that I explicitly defined result !== null condition
      // TypeScript considers that result can be null, so ignore this error.
      // @ts-ignore
      return CaseConverter.toCamelCase(result) as T;
    }
    return result;
  }

  //#endregion

  //#region ~API methods~

  /**
   * Database API. Information about chain, blocks and transactions.
   */
  public get database() {
    let _this = this;

    return {
      /**
       * Get information block.
       *
       * @param blockNum Block number.
       */
      getBlock(blockNum: number) {
        return _this.call<JsonType>(ApiNamespace.database, 'get_block', [blockNum]);
      },

      /**
       * Get initial information about chain properties.
       */
      getChainProperties() {
        return _this.call<GlobalProperty>(ApiNamespace.database, 'get_chain_properties', []);
      },

      /**
       * Get dynamic information about chain properties.
       */
      getDynamicGlobalProperties() {
        return _this.call<DynamicGlobalProperty>(ApiNamespace.database, 'get_dynamic_global_properties', []);
      },

      /**
       * Get information about chain objects.
       *
       * @param {Array<string>} objectIds Identifiers of objects.
       *
       * @returns {Array} Array of chain objects.
       */
      getObjects(objectIds: Array<string>) {
        return _this.call<JsonType>(ApiNamespace.database, 'get_objects', [objectIds]);
      },

      /**
       * Get informaton about account object by email address.
       *
       * @param email Account login (email).
       */
      getAccountByEmail(email: string) {
        return _this.call<Account>(ApiNamespace.database, 'get_account_by_email', [email]);
      }
    };
  }

  /**
   * Network Broadcast API. Methods to broadbast blocks and transactions.
   */
  public get network() {
    let _this = this;

    return {
      /**
       * Synchronous sends specified transaction to blockchain.
       *
       * @param transaction Transaction to be sent.
       */
      broadcastTransactionSynchronous(transaction: Transaction) {
        return _this.call<JsonType>(ApiNamespace.network, 'broadcast_transaction_synchronous', [transaction.value()]);
      }
    };
  }

  /**
   * Login API. Methods to manage current API session.
   */
  public get login() {
    let _this = this;

    return {
      /**
       * Authenticates user using authorization token generated before.
       *
       * @param token Authorization token generated by user.
       */
      login(token: string): Promise<void> {
        return _this.call<void>(ApiNamespace.login, 'login', [token]);
      },

      /**
       * Destroys authorization token used for user authorization.
       */
      logout(): Promise<void> {
        return _this.call<void>(ApiNamespace.login, 'logout', []);
      },

      /**
       * Updates user preferred language in this session.
       *
       * @param language New user preferred language.
       */
      setLanguage(language: Language): Promise<void> {
        return _this.call<void>(ApiNamespace.login, 'set_language', [language]);
      }
    };
  }

  /**
   * Poll API. Contains information about polls.
   */
  public get poll() {
    let _this = this;

    return {
      /**
       * Gets information about active polls.
       *
       * Objects are sorted descending by creation time. Returned value of this contains personal data if user is authenticated.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       * @param {string|undefined} topic Identifier of topic to filter polls.
       *
       * @return {Promise<List<PollVoteDelegationIncoming>>} A list of active polls.
       */
      getActivePolls(offset: number = 0, limit: number = 3, locality?: string, topic?: string): Promise<List<PollPreview>> {
        return _this.call<List<PollPreview>>(ApiNamespace.poll, 'get_active_polls', [offset, limit, locality ?? null, topic ?? null]);
      },

      /**
       * Gets information about finished polls.
       *
       * Objects are sorted descending by creation time. Returned value of this contains personal data if user is authenticated.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       * @param {string|undefined} topic Identifier of topic to filter polls.
       *
       * @return {Promise<List<PollVoteDelegationIncoming>>} A list of finished polls.
       */
      getInactivePolls(offset: number = 0, limit: number = 3, locality?: string, topic?: string): Promise<List<PollPreview>> {
        return _this.call<List<PollPreview>>(ApiNamespace.poll, 'get_inactive_polls', [offset, limit, locality ?? null, topic ?? null]);
      },

      /**
       * Get full information about poll by identifier.
       *
       * Returned value of this contains personal data if user is authenticated.
       *
       * @returns Full information about poll.
       */
      getPoll(id: string): Promise<Poll> {
        return _this.call<Poll>(ApiNamespace.poll, 'get_poll', [id]);
      },

      /**
       * Get all available topics on every language.
       */
      async getTopics(): Promise<Array<Topic>> {
        return await _this.call<Array<Topic>>(ApiNamespace.poll, 'get_topics', []);
        // return topic.map(t => ({
        //   id: t.id,
        //   name: t.name.reduce((result, [language, name]) => Object.assign(result, { [language]: name }), {}) as Dictionary<Language, string>
        // }));
      },

      /**
       * Get all available localities on every language.
       */
      async getLocalities(): Promise<Array<Locality>> {
        return await _this.call<Array<Locality>>(ApiNamespace.poll, 'get_localities', []);
        // return locality.map(t => ({
        //   id: t.id,
        //   name: t.name.reduce((result, [language, name]) => Object.assign(result, { [language]: name }), {}) as Dictionary<Language, string>
        // }));
      },

      /**
       * Get list of vote management rights delegated to current users.
       *
       * Pending delegated vote management rights will be displayed first. Objects are sorted descending by creation time.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       *
       * @return {Promise<List<PollVoteDelegationIncoming>>} A list of vote management rights delegated to current users.
       */
      getIncomingPollVoteDelegations(offset: number = 0, limit: number = 10): Promise<List<PollVoteDelegationIncoming>> {
        return _this.call<List<PollVoteDelegationIncoming>>(ApiNamespace.poll, 'get_incoming_poll_vote_delegations', [offset, limit]);
      },

      /**
       * Get list of vote management rights delegated by current users to others.
       *
       * Pending delegated vote management rights will be displayed first. Objects are sorted descending by creation time.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       *
       * @returns {Promise<List<PollVoteDelegationOutgoing>>} A list of vote management rights delegated by current users to others.
       */
      getOutgoingPollVoteDelegations(offset: number = 0, limit: number = 10): Promise<List<PollVoteDelegationOutgoing>> {
        return _this.call<List<PollVoteDelegationOutgoing>>(ApiNamespace.poll, 'get_outgoing_poll_vote_delegations', [offset, limit]);
      },

      /**
       * Search user account by partial or full name.
       *
       * This method itself supports name transliteration.
       *
       * @param {string} search A partial or full name of user to search.
       *
       * @returns {Promise<Array<PollAccount>>} Array of users satisfying search query.
       */
      getAccountsByName(search: string): Promise<Array<PollAccount>> {
        return _this.call<Array<PollAccount>>(ApiNamespace.poll, 'get_accounts_by_name', [search]);
      },

      /**
       * Check vote delegation availability.
       *
       * @param startDate Start date of period to be checked.
       * @param endDate End date of period to be checked.
       * @param topics Array of selected topics to check number of delegated votes to be lost.
       *
       * @returns Information about available topics to delegate votes and number of delegated votes to be lost after vote delegation.
       */
      getVoteDelegationAvailability(startDate: Date | string, endDate: Date | string, topics: Array<string>): Promise<PollVoteDelegationAvailability> {
        const start = new ChainTime(startDate);
        const end = new ChainTime(endDate);
        return _this.call<PollVoteDelegationAvailability>(ApiNamespace.poll, 'get_vote_delegation_availability', [start.value(), end.value(), topics]);
      },

      /**
       * Gets information about active polls in which current user participated.
       *
       * Objects are sorted descending by creation time.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       * @param {string|undefined} topic Identifier of topic to filter polls.
       *
       * @return {Promise<List<PollPreview>>} A list of active polls in which current user participated.
       */
      getMyActivePolls(offset: number = 0, limit: number = 3, topic?: string): Promise<List<PollPreview>> {
        return _this.call<List<PollPreview>>(ApiNamespace.poll, 'get_my_active_polls', [offset, limit, topic ?? null]);
      },

      /**
       * Gets information about finished polls in which current user participated.
       *
       * Objects are sorted descending by creation time.
       *
       * @param {number} offset Specifies the number of objects to skip before server starts to return objects from the request query.
       * @param {number} limit Limits the objects returned in a response to a specified number of objects.
       * @param {string|undefined} topic Identifier of topic to filter polls.
       *
       * @return {Promise<List<PollPreview>>} A list of finished polls in which current user participated.
       */
      getMyInactivePolls(offset: number = 0, limit: number = 3, topic?: string): Promise<List<PollPreview>> {
        return _this.call<List<PollPreview>>(ApiNamespace.poll, 'get_my_inactive_polls', [offset, limit, topic ?? null]);
      },
    };
  }

  //#endregion

  //#region ~Events~

  /**
   * Occures after web socket disconntects from remote server.
   */
  public onDisconnect: DisconnectEvent;

  //#endregion
}
