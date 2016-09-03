/**
 * Event Manager
 * @constructor
 */
var EventManager = function () {
};

EventManager._handlers = {};

/**
 *
 * @param topic
 * @param callback
 * @param context (optional)
 */
EventManager.subscribe = function (topic, callback, context) {
    if (!EventManager._handlers.hasOwnProperty(topic)) {
        EventManager._handlers[topic] = [];
    }

    EventManager._handlers[topic].push({
        callback: callback,
        context: context
    });
};

/**
 * Removes the subscription of a topic
 * @param topic
 * @param callback (for reference)
 */
EventManager.removeSubscription = function(topic, callback) {
    if (!EventManager._handlers[topic]) {
        return;
    }

    for (var i = EventManager._handlers[topic].length - 1; i >= 0; i--) {
        if (EventManager._handlers[topic][i].callback == callback) {
            EventManager._handlers[topic].splice(i, 1);
        }
    }

    // no more subscriptions for this topic?
    if (EventManager._handlers[topic].length == 0) {
        // nope... let's remove the topic then:
        delete EventManager._handlers[topic];
    }
};

/**
 *
 * @param topic
 */
EventManager.emit = function (topic) {
    // get the remaining arguments (if exist)
    var args = [], i;
    if (arguments.length > 1) {
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }

    if (EventManager._handlers.hasOwnProperty(topic)) {
        for (i = EventManager._handlers[topic].length - 1; i >= 0; i--) {
            if (EventManager._handlers[topic][i].callback) {
                EventManager._handlers[topic][i].callback.apply(EventManager._handlers[topic][i].context, args);

            } else {
                // this doesn't seem to exist anymore, let's remove it from the subscribers:
                EventManager._handlers[topic].splice(i, 1);

            }
        }
    }
};

/**
 * Clears all subscriptions
 */
EventManager.clear = function () {
    EventManager._handlers = {};
};