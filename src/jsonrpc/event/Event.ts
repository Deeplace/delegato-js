import EventHandler from "./EventHandler";

/**
 * Delegate to store and raise handlers of specified event.
 */
export default class Event<T> {

  /**
   * Stores all event handlers which should be called on event raise.
   */
  private handlers: Array<EventHandler<T>>;

  constructor() {
    this.handlers = [];
  }

  /**
   * Appends event handlers with specified one.
   *
   * @param {EventHandler<T>} handler Event handler to be added.
   */
  public attach(handler: EventHandler<T>) {
    this.handlers.push(handler);
  }

  /**
   * Removes specified event handler.
   *
   * @param {EventHandler<T>} handler Event handler to be removed.
   */
  public detach(handler: EventHandler<T>) {
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] === handler) {
        delete this.handlers[i];
        return;
      }
    }
  }

  /**
   * Rasie the event and call all event handlers.
   *
   * @param {T} data Data to be passed to each event handler.
   */
  public raise(data: T) {
    this.handlers.forEach(handler => {
      if (typeof handler === 'function') {
        handler(data);
      }
    });
  }
}