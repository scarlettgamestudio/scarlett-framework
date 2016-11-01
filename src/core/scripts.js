/**
 * Scripts singleton
 * @constructor
 */
function Scripts() {
}

Scripts._store = {};

/**
 * Setup a script adding event handlers and such
 * @private
 */
Scripts._setupScript = function (script) {
    script.properties = {
        _store: {},
        _target: script,
        add: function (name, attr) {
            // save on the target's properties store the attributes:
            this._store[name] = attr;
        },
        get: function (name) {
            return this._store[name];
        },
        getAll: function () {
            return this._store;
        }
    };
};

/**
 * Clear all the stored scripts
 */
Scripts.clear = function () {
    Scripts._store = {};
};

/**
 * Creates and stores a script code
 * @returns {ObjectComponent}
 */
Scripts.addScript = function (name) {
    var script = function instance() {
    };
    Scripts._store[name] = script;
    Scripts._setupScript(script);
    return script;
};
// alias:
sc.addScript = Scripts.addScript;

/**
 * Generates a component from one stored script
 * @param scriptName
 * @param gameObject (optional)
 */
Scripts.generateComponent = function (scriptName, gameObject) {
    if (!Scripts._store[scriptName]) {
        return null;
    }

    var component = Object.create(Scripts._store[scriptName].prototype);
    component._name = scriptName;

    // now we need to assign all the instance properties defined:
    var properties = Scripts._store[scriptName].properties.getAll();
    var propertyNames = Object.keys(properties);

    if (propertyNames && propertyNames.length > 0) {
        propertyNames.forEach(function (propName) {
            // assign the default value if exists:
            component[propName] = properties[propName].default;
        });
    }

    if (gameObject) {
        gameObject.addComponent(component);
    }

    return component;
};