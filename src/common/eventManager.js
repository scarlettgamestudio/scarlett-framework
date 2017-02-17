// unique key
let _eventManagerSingleton = Symbol('eventManagerSingleton');

/**
 * Event Manager Singleton Class
 */
class EventManagerSingleton {

    //#region Constructors

    constructor(eventManagerSingletonToken) {
        if (_eventManagerSingleton !== eventManagerSingletonToken) {
            throw new Error('Cannot instantiate directly.');
        }
        this._handlers = {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static get instance() {
        if (!this[_eventManagerSingleton]) {
            this[_eventManagerSingleton] = new EventManagerSingleton(_eventManagerSingleton);
        }

        return this[_eventManagerSingleton];
    }

    //#endregion

    /**
     *
     * @param topic
     * @param callback
     * @param context (optional)
     */
    subscribe(topic, callback, context) {
        if (!this._handlers.hasOwnProperty(topic)) {
            this._handlers[topic] = [];
        }

        this._handlers[topic].push({
            callback: callback,
            context: context
        });
    }

    /**
     * Removes the subscription of a topic
     * @param topic
     * @param callback (for reference)
     */
    removeSubscription(topic, callback) {
        if (!this._handlers[topic]) {
            return;
        }

        for (let i = this._handlers[topic].length - 1; i >= 0; i--) {
            if (this._handlers[topic][i].callback == callback) {
                this._handlers[topic].splice(i, 1);
            }
        }

        // no more subscriptions for this topic?
        if (this._handlers[topic].length == 0) {
            // nope... let's remove the topic then:
            delete this._handlers[topic];
        }
    }

    /**
     *
     * @param topic
     */
    emit(topic) {
        // get the remaining arguments (if exist)
        let args = [], i;
        if (arguments.length > 1) {
            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
        }

        if (!this._handlers.hasOwnProperty(topic)) {
            return;
        }

        for (i = this._handlers[topic].length - 1; i >= 0; i--) {
            if (this._handlers[topic][i].callback) {
                this._handlers[topic][i].callback.apply(this._handlers[topic][i].context, args);

            } else {
                // this doesn't seem to exist anymore, let's remove it from the subscribers:
                this._handlers[topic].splice(i, 1);

            }
        }
    }

    /**
     * Clears all subscriptions
     */
    clear() {
        this._handlers = {};
    }

    //#endregion
}

// alias
let EventManager = EventManagerSingleton.instance;