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
    this._transformMatrix = mat4.create();
}

GameObject.prototype.equals = function (other) {
    if (other.getUID) {
        return this._uid === other.getUID();
    }

    return this === other;
};

GameObject.prototype.getBaseWidth = function() {
    return 1;
};

GameObject.prototype.getBaseHeight = function() {
    return 1;
};

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

GameObject.prototype.getMatrix = function () {
    mat4.identity(this._transformMatrix);
    mat4.translate(this._transformMatrix, this._transformMatrix, [this.transform.getPosition().x, this.transform.getPosition().y, 0]);

    return this._transformMatrix;
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

/**
 * Gets the boundary of this game object with added bulk if needed
 * @param bulk
 * @returns {Boundary}
 */
GameObject.prototype.getBoundary = function (bulk) {
    var mat = this.getMatrix();

    var boundary = new Boundary(
        Vector2.transformMat4(new Vector2(0, 0), mat),
        Vector2.transformMat4(new Vector2(1, 0), mat),
        Vector2.transformMat4(new Vector2(1, 1), mat),
        Vector2.transformMat4(new Vector2(0, 1), mat)
    );

    if (bulk) {
        boundary.topLeft.x -= bulk;
        boundary.topLeft.y -= bulk;
        boundary.topRight.x += bulk;
        boundary.topRight.y -= bulk;
        boundary.bottomRight.x += bulk;
        boundary.bottomRight.y += bulk;
        boundary.bottomLeft.x -= bulk;
        boundary.bottomLeft.y += bulk;
    }

    return boundary;
};

/**
 * Fast boundary mapping without taking in consideration rotation
 * @param bulk
 * @returns {Rectangle}
 */
GameObject.prototype.getRectangleBoundary = function (bulk) {
    var vertices = this.getBoundary(bulk);

    // find the min and max width to form the rectangle boundary
    var minX = Math.min(vertices.topLeft.x, vertices.topRight.x, vertices.bottomLeft.x, vertices.bottomRight.x);
    var maxX = Math.max(vertices.topLeft.x, vertices.topRight.x, vertices.bottomLeft.x, vertices.bottomRight.x);
    var minY = Math.min(vertices.topLeft.y, vertices.topRight.y, vertices.bottomLeft.y, vertices.bottomRight.y);
    var maxY = Math.max(vertices.topLeft.y, vertices.topRight.y, vertices.bottomLeft.y, vertices.bottomRight.y);

    // return the generated rectangle:
    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 *
 * @param gameObject
 * @param bulk
 * @param bulkOther
 * @returns {boolean}
 */
GameObject.prototype.collidesWith = function (gameObject, bulk, bulkOther) {
    var boundaryA = this.getBoundary(bulk);
    var boundaryB = gameObject.getBoundary(bulkOther);

    return Boundary.overlap(boundaryA, boundaryB);
};

/**
 * Tests collision with a point
 * @param point
 * @param bulk
 * @returns {boolean}
 */
GameObject.prototype.collidesWithPoint = function (point, bulk) {
    var boundaryA = this.getBoundary(bulk);
    var boundaryB = new Boundary(
        new Vector2(point.x, point.y),
        new Vector2(point.x + 1, point.y),
        new Vector2(point.x + 1, point.y + 1),
        new Vector2(point.x, point.y + 1));

    return Boundary.overlap(boundaryA, boundaryB);
};

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

