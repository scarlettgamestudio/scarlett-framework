/**
 * GameObject class
 */
AttributeDictionary.addRule("gameobject", "transform", {ownContainer: true});
AttributeDictionary.addRule("gameobject", "_parent", {visible: false});

function GameObject(params) {
    params = params || {};

    // public properties:
    this.name = params.name || "GameObject";

    if (params.transform) {
        params.transform.gameObject = this;
    }

    this.transform = params.transform || new Transform({gameObject: this});

    // private properties:
    this._uid = generateUID();
    this._parent = params.parent || null;
    this._children = params.children || [];
    this._components = params.components || [];
}

GameObject.prototype.getType = function () {
    return "GameObject";
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
    if (gameObject.getParent() != null) {
        gameObject.getParent().removeChild(gameObject);
    }

    this._parent = gameObject;
};

GameObject.prototype.removeChild = function (gameObject) {
    for (var i = this._children.length - 1; i >= 0; i--) {
        if (this._children[i].getUID() == gameObject.getUID()) {
            this._children.splice(i, 1);
            break;
        }
    }
};

GameObject.prototype.getChildren = function () {
    return this._children;
};

GameObject.prototype.addChild = function (gameObject) {
    // update the object parent
    gameObject.setParent(gameObject);

    // add this to our children array
    this._children.push(gameObject);
};

GameObject.prototype.addComponent = function (component) {
    if (isFunction(component.setGameObject)) {
        component.setGameObject(this);
    }

    this._components.push(component);
};

GameObject.prototype.update = function (delta) {
    // update children:
    this._children.forEach(function (elem) {
        if (elem.update) {
            elem.update(delta);
        }
    });
};

GameObject.prototype.render = function (delta, spriteBatch) {
    // render children:
    this._children.forEach(function (elem) {
        if (elem.render) {
            elem.render(delta, spriteBatch);
        }
    });
};

GameObject.prototype.getComponents = function () {
    return this._components;
};

// functions:
GameObject.prototype.objectify = function () {
    return {
        name: this.name,
        transform: this.transform.objectify(),
        children: Objectify.array(this._children),
        components: Objectify.array(this._components)
    };
};

GameObject.restore = function (data) {
    return new GameObject({
        name: data.name,
        transform: Transform.restore(data.transform),
        children: Objectify.restoreArray(data.children),
        components: Objectify.restoreArray(data.components)
    });
};

GameObject.prototype.unload = function () {
    for (var i = 0; i < this._components.length; ++i) {
        if (isFunction(this._components[i].unload)) {
            this._components[i].unload();
        }
    }
};

