import { JsonType } from '..';
import Event from './Event';
import EventHandler from './EventHandler';

type ConnectEvent = Event<void>;
type DisconnectEvent = Event<void>;
type NotificationEvent = Event<JsonType>;

export { Event, EventHandler, ConnectEvent, DisconnectEvent, NotificationEvent };