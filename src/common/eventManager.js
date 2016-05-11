/**
 * Event Manager
 * @constructor
 */
var EventManager = function () {};

EventManager._handlers = {};

/**
 *
 * @param topic
 * @param callback
 * @param context (optional)
 */
EventManager.subscribe = function(topic, callback, context) {
    if(!EventManager._handlers.hasOwnProperty(topic)) {
        EventManager._handlers[topic] = [];
    }

    EventManager._handlers[topic].push({
        callback: callback,
        context: context
    });
};

/**
 *
 * @param topic
 */
EventManager.emit = function(topic) {
    // get the remaining arguments (if exist)
    var args = [];
    if(arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }

    if(EventManager._handlers.hasOwnProperty(topic)) {
        EventManager._handlers[topic].forEach(function(handler) {
            // call the function by sending the arguments and applying the given context (might not be available)
            handler.callback.apply(handler.context, args);
        });
    }
};

/**
 * Clears all subscriptions
 */
EventManager.clear = function() {
    EventManager._handlers = {};
};