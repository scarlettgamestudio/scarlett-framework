/**
 * Transform class
 */
AttributeDictionary.addRule("transform", "gameObject", {ownContainer: true});

function Transform(params) {
    params = params || {};

    // public properties:
    this.gameObject = params.gameObject || null;

    // private properties:
    this._position = params.position || new Vector2();
    this._rotation = params.rotation || 0.0;
    this._scale = params.scale || new Vector2(1.0, 1.0);

    this._overridePositionFunction = null;
    this._overrideRotationFunction = null;
    this._overrideScaleFunction = null;
}

Transform.prototype.clearPositionGetter = function () {
    this._overridePositionFunction = null;
};

Transform.prototype.clearRotationGetter = function () {
    this._overrideRotationFunction = null;
};

Transform.prototype.clearScaleGetter = function () {
    this._overrideScaleFunction = null;
};

Transform.prototype.overridePositionGetter = function (overrideFunction) {
    this._overridePositionFunction = overrideFunction;
};

Transform.prototype.overrideScaleGetter = function (overrideFunction) {
    this._overrideScaleFunction = overrideFunction;
};

Transform.prototype.overrideRotationGetter = function (overrideFunction) {
    this._overrideRotationFunction = overrideFunction;
};

Transform.prototype.setPosition = function (x, y) {
    this._position.set(x, y);
    this.gameObject.propagatePropertyUpdate("Position", this._position);
};

Transform.prototype.getPosition = function () {
    if (isFunction(this._overridePositionFunction)) {
        return this._overridePositionFunction();
    }

    return this._position;
};

Transform.prototype.translate = function(x, y) {
    var curPos = this.getPosition();
    this.setPosition(curPos.x + (x || 0), curPos.y + (y || 0));
};

Transform.prototype.rotate = function(value) {
    this.setRotation(this.getRotation() + (value || 0));
};

Transform.prototype.scale = function(x, y) {
    var curScale = this.getScale();
    this.setPosition(curScale.x + (x || 0), curScale.y + (y || 0));
};

Transform.prototype.setRotation = function (value) {
    this._rotation = value;
    this.gameObject.propagatePropertyUpdate("Rotation", this._rotation);
};

Transform.prototype.getRotation = function () {
    if (isFunction(this._overrideRotationFunction)) {
        return this._overrideRotationFunction();
    }

    return this._rotation;
};

Transform.prototype.setScale = function (x, y) {
    this._scale.set(x, y || x);
    this.gameObject.propagatePropertyUpdate("Scale", this._scale);
};

Transform.prototype.getScale = function () {
    if (isFunction(this._overrideScaleFunction)) {
        return this._overrideScaleFunction();
    }

    return this._scale;
};

Transform.prototype.clone = function() {
    return Transform.restore(this.objectify());
};

Transform.prototype.objectify = function () {
    return {
        position: this._position.objectify(),
        rotation: this._rotation,
        scale: this._scale.objectify()
    };
};

Transform.restore = function (data) {
    return new Transform({
        position: Vector2.restore(data.position),
        rotation: data.rotation,
        scale: Vector2.restore(data.scale)
    });
};

Transform.prototype.unload = function () {

};
