/**
 * Event Manager Singleton Class
 */
class EventManagerSingleton {

    //#region Fields

    private _handlers: Object;

    //#endregion

    //#region Static Fields

    private static _instance: EventManagerSingleton;

    //#endregion

    //#region Constructors

    private constructor () {
        this._handlers = {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    //#region Static Methods

    static get instance(): EventManagerSingleton {
        return this._instance || (this._instance = new EventManagerSingleton());
    }

    //#endregion

    //#endregion

    /**
     *
     * @param topic
     * @param callback
     * @param context (optional)
     */
    subscribe(topic: string, callback: Function, context: string): void {
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
    removeSubscription(topic: string, callback: Function): void {
        if (!this._handlers[topic]) {
            return;
        }

        for (let i = this._handlers[topic].length - 1; i >= 0; i--) {
            if (this._handlers[topic][i].callback === callback) {
                this._handlers[topic].splice(i, 1);
            }
        }

        // no more subscriptions for this topic?
        if (this._handlers[topic].length === 0) {
            // nope... let's remove the topic then:
            delete this._handlers[topic];
        }
    }

    /**
     *
     * @param topic
     */
    emit(topic: string) {
        // get the remaining arguments (if exist)
        let args: Array<any> = [];
        let i: number;

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
    clear(): void {
        this._handlers = {};
    }

    //#endregion

}

/**
 * Event Manager alias to Event Manager Singleton instance
 */
export const EventManager = EventManagerSingleton.instance;
