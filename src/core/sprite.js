/**
 * Sprite class
 */
function Sprite(params) {
	params = params || {};
	params.name = params.name || "Sprite";

	GameObject.call(this, params);

	// public properties:

	// private properties:
	this._texture = params.texture;

}

inheritsFrom(Sprite, GameObject);

Sprite.prototype.getTexture = function() {
	return this._texture;
};

// functions:
Sprite.prototype.toJSON = function() {
	// TODO: implement
	return "";
};

Sprite.prototype.unload = function () {

};

Sprite.prototype.changeSource = function(src) {

};

