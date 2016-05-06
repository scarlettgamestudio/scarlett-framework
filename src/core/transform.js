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

}

Transform.prototype.setPosition = function(x, y) {
    this._position.set(x, y);
};

Transform.prototype.getPosition = function() {
  return this._position;
};

Transform.prototype.setRotation = function(value) {
    this._rotation = value;
};

Transform.prototype.getRotation = function() {
    return this._rotation;
};

Transform.prototype.setScale = function(x, y) {
    this._scale.set(x, y);
};

Transform.prototype.getScale = function() {
    return this._scale;
};

Transform.prototype.toJSON = function() {
    // TODO: implement
    return "";
};

Transform.prototype.unload = function () {

};
