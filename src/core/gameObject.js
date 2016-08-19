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

GameObject.prototype.getBoundary = function () {
    var mat = this.getMatrix();

    return new Boundary(
        Vector2.transformMat4(new Vector2(0, 0), mat),
        Vector2.transformMat4(new Vector2(1, 0), mat),
        Vector2.transformMat4(new Vector2(1, 1), mat),
        Vector2.transformMat4(new Vector2(0, 1), mat)
    );
};

/**
 * Fast boundary mapping without taking in consideration rotation
 * @param bulk
 * @returns {Rectangle}
 */
GameObject.prototype.getRectangleBoundary = function (bulk) {
    var vertices = this.getBoundary();
    bulk = bulk || 0;

    // find the min and max width to form the rectangle boundary
    var minX = Math.min(vertices.topLeft.x - bulk, vertices.topRight.x + bulk, vertices.bottomLeft.x - bulk, vertices.bottomRight.x + bulk);
    var maxX = Math.max(vertices.topLeft.x - bulk, vertices.topRight.x + bulk, vertices.bottomLeft.x - bulk, vertices.bottomRight.x + bulk);
    var minY = Math.min(vertices.topLeft.y - bulk, vertices.topRight.y - bulk, vertices.bottomLeft.y + bulk, vertices.bottomRight.y + bulk);
    var maxY = Math.max(vertices.topLeft.y - bulk, vertices.topRight.y - bulk, vertices.bottomLeft.y + bulk, vertices.bottomRight.y + bulk);

    // return the generated rectangle:
    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 * Tests collision with a point
 * @param point
 */
GameObject.prototype.collidesWith = function (point) {
    // the following collision detection is based on the separating axis theorem:
    // http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
    var boundaryA = this.getBoundary();
    var boundaryB = new Boundary(new Vector2(point.x, point.y), new Vector2(point.x + 1, point.y), new Vector2(point.x + 1, point.y + 1), new Vector2(point.x, point.y + 1));
    var normA = this.getBoundary().getNormals();
    var normB = boundaryB.getNormals();

    function getMinMax (boundary, norm) {
        var probeA = boundary.topRight.dot(norm);
        var probeB = boundary.bottomRight.dot(norm);
        var probeC = boundary.bottomLeft.dot(norm);
        var probeD = boundary.topLeft.dot(norm);

        return {
            max: Math.max(probeA, probeB, probeC, probeD),
            min: Math.min(probeA, probeB, probeC, probeD)
        }
    }

    var p1, p2, normNode, norm;
    for(var i = 0; i < 4; i++) {
        normNode = i >= 2 ? normB : normA;
        norm = i % 2 == 0 ? normNode.bottom : normNode.right;
        p1 = getMinMax(boundaryA, norm);
        p2 = getMinMax(boundaryB, norm);

        if (p1.max < p2.min || p2.max < p1.min) {
            return false;
        }
    }

    return true;
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

