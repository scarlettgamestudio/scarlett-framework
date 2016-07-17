/**
 * GameObject class
 */
AttributeDictionary.addRule("gameobject", "transform", {ownContainer: true});

function GameObject(params) {
    params = params || {};

    // public properties:
    this.name = params.name || "GameObject";
    this.transform = new Transform({
        gameObject: this
    });

    // private properties:
    this._parent = params.parent || null;
    this._uid = generateUID();
    this._children = [];
    this._components = [];
}

GameObject.prototype.getType = function () {
    return "gameobject";
};

GameObject.prototype.getUID = function () {
    return this._uid;
};

GameObject.prototype.propagatePropertyUpdate = function (property, value) {
    for (var i = 0; i < this._components.length; ++i) {
        if (this._components[i]["onGameObject" + property + "Updated"]) {
            this._components[i]["onGameObject" + property + "Updated"](value);
        }
    }
};

GameObject.prototype.getParent = function () {
    return this._parent;
};

GameObject.prototype.setParent = function (gameObject) {
    // TODO: check if already had parent, if so, remove first from there..
    this._parent = gameObject;
};

GameObject.prototype.getChildren = function () {
    return this._children;
};

GameObject.prototype.addChild = function (gameObject) {
    this._children.push(gameObject);
};

GameObject.prototype.addComponent = function (component) {
    if (isFunction(component.setGameObject)) {
        component.setGameObject(this);
    }

    this._components.push(component);
};

GameObject.prototype.render = function (delta, spriteBatch) {
    // nothing to do here..
};

GameObject.prototype.getComponents = function () {
    return this._components;
};

// functions:
GameObject.prototype.toJSON = function () {
    // TODO: implement
    return "";
};

GameObject.prototype.unload = function () {
    for (var i = 0; i < this._components.length; ++i) {
        if (isFunction(this._components[i].unload)) {
            this._components[i].unload();
        }
    }
};

