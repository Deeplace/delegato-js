//#region ~Error~

import { ConnectionError, InternalError, MethodError, ProtocolError } from './error';
export { ConnectionError, InternalError, MethodError, ProtocolError };

//#endregion

//#region ~Event~

import { Event, EventHandler, ConnectEvent, DisconnectEvent, NotificationEvent } from './event';
export { Event, EventHandler, ConnectEvent, DisconnectEvent, NotificationEvent };

//#endregion

//#region ~Types~

export type JsonNull = null;
export type JsonString = string;
export type JsonNumber = number;
export type JsonArray = Array<JsonType>;
export type JsonObject = { [key: string]: JsonType };
export type JsonBoolean = boolean;
export type JsonType = JsonNull | JsonString | JsonNumber | JsonArray | JsonObject | JsonBoolean;

//#endregion

//#region ~Default~

import JsonRpcWebSocket from './JsonRpcWebSocket';
export default JsonRpcWebSocket;

//#endregion