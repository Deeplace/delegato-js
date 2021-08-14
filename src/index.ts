//#region ~JsonRpc~

import JsonRpcWebSocket, { ConnectionError, InternalError, MethodError, ProtocolError, Event, EventHandler, ConnectEvent, DisconnectEvent, NotificationEvent, JsonNull, JsonString, JsonNumber, JsonArray, JsonObject, JsonType } from './jsonrpc';
export { JsonRpcWebSocket, ConnectionError, InternalError, MethodError, ProtocolError, Event, EventHandler, ConnectEvent, DisconnectEvent, NotificationEvent, JsonNull, JsonString, JsonNumber, JsonArray, JsonObject, JsonType };

//#endregion

//#region ~Api~

import Api, { ApiNamespace, LocalStorage, MemoryStorage, Storage, poll, database } from './api';
export { Api, ApiNamespace, LocalStorage, MemoryStorage, Storage, poll, database };

//#endregion

//#region ~Chain~

import { ChainArray, ChainBoolean, ChainBytes, ChainFixedBytes, ChainMap, ChainObjectId, ChainString, ChainTime, ChainType, ChainInt64, ChainUInt8, ChainUInt16, ChainUInt32, ChainUInt64, Language, LogicError, Operation, operations, PrivateKey, PrivateKeyType, PublicKey, Role, Signature, Token, Transaction, ValidationError } from './chain';
export { ChainArray, ChainBoolean, ChainBytes, ChainFixedBytes, ChainMap, ChainObjectId, ChainString, ChainTime, ChainType, ChainInt64, ChainUInt8, ChainUInt16, ChainUInt32, ChainUInt64, Language, LogicError, Operation, operations, PrivateKey, PrivateKeyType, PublicKey, Role, Signature, Token, Transaction, ValidationError };

//#endregion

//#region ~ECC~

import { sha256 as sha256Data } from './ecc';

/**
 * Creates SHA-256 hash for specified data.
 *
 * @param {string} s String to be hashed.
 *
 * @returns SHA-256 hash of specified string.
 */
export function sha256(s: string): string {
  return sha256Data(s, 'hex');
}

//#endregion
