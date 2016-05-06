/**
 * Transform class
 */
function Transform(params) {
	params = params || {};

	// public properties:
	this.gameObject = params.gameObject || null;


	// private properties:
	this._position = new Vector2();
	this._rotation = 0.0;
	this._scale = new Vector2(1.0, 1.0);

	this._overridePositionFunction = null;
	this._overrideRotationFunction = null;
	this._overrideScaleFunction = null;
}

Transform.prototype.clearPositionGetter = function() {
	this._overridePositionFunction = null;
};

Transform.prototype.clearRotationGetter = function() {
	this._overrideRotationFunction = null;
};

Transform.prototype.clearScaleGetter = function() {
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
	this._scale.set(x, y);
	this.gameObject.propagatePropertyUpdate("Scale", this._scale);
};

Transform.prototype.getScale = function () {
	if (isFunction(this._overrideScaleFunction)) {
		return this._overrideScaleFunction();
	}

	return this._scale;
};

Transform.prototype.toJSON = function () {
	// TODO: implement
	return "";
};

Transform.prototype.unload = function () {

};
