/**
 * GameObject class
 */
AttributeDictionary.addRule("gameobject", "transform", {ownContainer: true});
AttributeDictionary.addRule("gameobject", "_parent", {visible: false});

function GameObject(params) {
    params = params || {};

    // public properties:
    this.name = params.name || "GameObject";
    this.enabled = true;

    if (params.transform) {
        params.transform.gameObject = this;
    }

    this.transform = params.transform || new Transform({gameObject: this});

    // private properties:
    this._uid = generateUID();
    this._parent = params.parent || null;
    this._children = params.children || [];
    this._components = params.components || [];
    this._transformMatrix = new Matrix4();
}

GameObject.prototype.equals = function (other) {
    if (other.getUID) {
        return this._uid === other.getUID();
    }

    return this === other;
};

GameObject.prototype.getBaseWidth = function () {
    return 1;
};

GameObject.prototype.getBaseHeight = function () {
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

GameObject.prototype.removeParent = function () {
    if (this._parent) {
        this._parent.removeChild(this);
    } else {
        GameManager.activeScene.removeGameObject(this);
    }

    this._parent = null;
};

GameObject.prototype.setParent = function (gameObject) {
    if (!gameObject) {
        // since there is no game object specified we will try to look for a scene related to this game object
        // and then add it to the root hierarchy:
        if (GameManager.activeScene) {
            GameManager.activeScene.addGameObject(this);
        }

    } else {
        // does the object has a parent?
        if (this.getParent() != null) {
            this.getParent().removeChild(this);

        } else {
            // maybe is part of a game scene root hierarchy? if so try to remove from that
            if (GameManager.activeScene) {
                GameManager.activeScene.removeGameObject(this);
            }
        }

        gameObject.addChild(this);
    }
};

GameObject.prototype.removeChild = function (gameObject) {
    for (var i = this._children.length - 1; i >= 0; i--) {
        if (this._children[i].getUID() == gameObject.getUID()) {
            return this._children.splice(i, 1);
        }
    }
};

GameObject.prototype.getChildren = function () {
    return this._children;
};

GameObject.prototype.addChild = function (gameObject, index) {
    // let's be safe, make sure to remove parent if any
    gameObject.removeParent();

    // update the object parent
    gameObject._parent = this;

    // add this to our children array
    if (isObjectAssigned(index)) {
        this._children.insert(index, gameObject);
    } else {
        this._children.push(gameObject);
    }
};

GameObject.prototype.getHierarchyHash = function () {
    if (this._parent) {
        return this._parent.getHierarchyHash() + "." + this._uid;
    }
    return this._uid + "";
};

GameObject.prototype.isChild = function (gameObject) {
    // check if is a child simply by getting the hierarchy hash:
    var hierarchyHash = gameObject.getHierarchyHash().split(".");  // this . x . y . z . other
    var thisIndex = hierarchyHash.indexOf(this._uid + ""), otherIndex = hierarchyHash.indexOf(gameObject.getUID() + "");
    return otherIndex > thisIndex && thisIndex >= 0;

    // this way takes away more resources:
    /*for (var i = 0; i < this._children.length; ++i) {
        if (this._children[i].equals(gameObject)) {
            return true;
        } else {
            if (this._children[i].isChild(gameObject)) {
                return true;
            }
        }
    }
    return false;*/
};

GameObject.prototype.addComponent = function (component) {
    if (isFunction(component.setGameObject)) {
        component.setGameObject(this);
    }

    // set the related component game object:
    component.gameObject = this;

    this._components.push(component);
};

GameObject.prototype.update = function (delta) {
    if (!this.enabled) {
        return;
    }

    // update children:
    this._children.forEach(function (elem) {
        if (elem.update) {
            elem.update(delta);
        }
    });

    this._components.forEach(function (component) {
        if (component.update) {
            component.update(delta);
        }
    });
};

GameObject.prototype.render = function (delta, spriteBatch) {
    if (!this.enabled) {
        return;
    }

    // render children:
    this._children.forEach(function (elem) {
        if (elem.render) {
            elem.render(delta, spriteBatch);
        }
    });

    this._components.forEach(function (component) {
        if (component.render) {
            component.render(delta, spriteBatch);
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
    return this.getBoundary(bulk).overlapsWith(gameObject.getBoundary(bulkOther));
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

