/**
 * GameObject class
 */
function GameObject(params) {
	params = params || {};

	// public properties:
	this.name = params.name || "GameObject";

	AttributeDictionary.addRule(this, "parent", {visible:false});
	this.parent = params.parent || null;

	AttributeDictionary.addRule(this, "transform", {ownContainer: true});
	this.transform = new Transform({
		gameObject: this
	});

	// private properties:
	this._uid = generateUID();
	this._components = [];
}

GameObject.prototype.propagatePropertyUpdate = function (property, value) {
	for (var i = 0; i < this._components.length; ++i) {
		if (this._components[i]["onGameObject" + property + "Updated"]) {
			this._components[i]["onGameObject" + property + "Updated"](value);
		}
	}
};

GameObject.prototype.addComponent = function (component) {
	if (isFunction(component.setGameObject)) {
		component.setGameObject(this);
	}

	this._components.push(component);
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

