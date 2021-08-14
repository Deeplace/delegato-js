import WebSocket from 'isomorphic-ws';
import { JsonType, ConnectionError, InternalError, ProtocolError, Event, ConnectEvent, DisconnectEvent, NotificationEvent, MethodError } from './';

type onMessageEvent = {
  data: any,
  type: string,
  target: WebSocket,
};

type onCloseEvent = {
  wasClean: boolean,
  code: number,
  reason: string,
  target: WebSocket,
};

type onErrorEvent = {
  error: any,
  message: any,
  type: string,
  target: WebSocket
};

/**
 * JSON-RPC 2.0 client which connects to server via web socket.
 */
export default class JsonRpcWebSocket {

  //#region ~Fields~

  /**
   * Web socket for connection to remote server.
   */
  private ws?: WebSocket;

  /**
   * Identifier of JSON-RPC message to make difference between two messages.
   */
  private messageId: number;

  /**
   * Collection of promise resolves and rejects for each message.
   */
  private executors: Map<number, [Function, Function]>;

  //#endregion

  //#region ~Properties~

  /**
   * Defines if web socket is connected to remove server.
   */
  public get isConnected() {
    return this.ws !== undefined && this.ws.readyState === WebSocket.OPEN;
  }

  //#endregion

  //#region ~Constructor~

  constructor() {
    this.messageId = 0;
    this.executors = new Map<number, [Function, Function]>();
    this.onNofification = new Event<JsonType>();
    this.onConnect = new Event<void>();
    this.onDisconnect = new Event<void>();
  }

  //#endregion

  //#region ~Public methods~

  /**
   * Connects web socket to remote server.
   *
   * @param {string} address IP address of remote server to connect.
   */
  public connect(address: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(address);
      let onOpen = () => {
        if (this.ws !== undefined) {
          this.ws.removeEventListener('open', onOpen);
          this.ws.removeEventListener('error', onError);
          this.ws.addEventListener('message', this.onMessage.bind(this));
          this.ws.addEventListener('error', this.onError.bind(this));
          resolve();
          this.onConnect.raise();
        }
        else {
          delete this.ws;
          reject(new ConnectionError(`Cannot connect to ${address}`));
        }
      };
      let onError = () => {
        this.disconnect();
        delete this.ws;
        reject(new ConnectionError(`Cannot connect to ${address}`));
      };
      this.ws.addEventListener('open', onOpen);
      this.ws.addEventListener('error', onError);
    });
  }

  /**
   * Disconnects web socket from remote server.
   */
  public disconnect() {
    if (this.ws !== undefined) {
      this.ws.removeEventListener('message', this.onMessage);
      this.ws.removeEventListener('error', this.onError);
      this.ws.close();
      delete this.ws;
      this.onDisconnect.raise();
    }
  }

  /**
   * Makes remote call of procedure.
   *
   * @param {string} method Name of method to be called.
   * @param {Array} params Parameters to be passed to method.
   *
   * @returns {Promise<JsonType>} Response from remote server.
   */
  public call(method: string, params: Array<JsonType>): Promise<JsonType> {
    if (this.ws === undefined) {
      throw new ConnectionError('WebSocket is not connected.');
    }
    return new Promise((resolve, reject) => {
      let id = this.messageId++;
      this.executors.set(id, [resolve, reject]);
      if (this.ws === undefined) {
        throw new ConnectionError('WebSocket is not connected.');
      }
      this.ws.send(JSON.stringify({
        'jsonrpc': '2.0',
        'method': method,
        'params': params,
        'id': id
      }), error => {
        if (error !== undefined) {
          let executor = this.executors.get(id);
          if (executor !== undefined) {
            executor[1](error);
          }
        }
      });
    });
  }

  //#endregion

  //#region ~Private methods~

  /**
   * Main hadler for messages recieved from server.
   *
   * @param {string} message The message recieved from server.
   */
  private onMessage(event: onMessageEvent) {
    let messageObj = JSON.parse(event.data);
    if (typeof messageObj === 'object') {
      if ('id' in messageObj) {
        let id = messageObj['id'];
        let executor = this.executors.get(id);
        if (executor === undefined) {
          throw new InternalError('Method call cannot be found.');
        }
        if ('result' in messageObj) {
          executor[0](messageObj['result'] as JsonType);
          this.executors.delete(id);
        }
        else if('error' in messageObj) {
          executor[1](new MethodError(messageObj['error'] as JsonType));
          this.executors.delete(id);
        }
        else {
          throw new ProtocolError('The result member or error member MUST be included.');
        }
      }
      else {
        if ('result' in messageObj) {
          this.onNofification.raise(messageObj['result'] as JsonType);
        }
      }
    }
    else {
      throw new ProtocolError('Server MUST reply with Object.');
    }
  }

  /**
   * Main handler for errors occurred.
   *
   * @param error The error occurred.
   */
  private onError(event: onErrorEvent) {
    this.disconnect();
    throw event;
  }

  //#endregion

  //#region ~Events~

  /**
   * Occures when server returns notification message.
   */
  public onNofification: NotificationEvent;

  /**
   * Occures after web socket connects to remote server.
   */
  public onConnect : ConnectEvent;

  /**
   * Occures after web socket disconntects from remote server.
   */
  public onDisconnect : DisconnectEvent;

  //#endregion

}