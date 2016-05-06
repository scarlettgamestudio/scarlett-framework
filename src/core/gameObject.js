/**
 * GameObject class
 */
function GameObject(params) {
    params = params || {};

    // public properties:
    this.name = params.name || "Entity";
    this.parent = params.parent || null;
    this.components = params.components || [];
    this.transform = new Transform({
        gameObject: this
    });

    // private properties:
    this._uid = generateUID();
    
}

// functions:
GameObject.prototype.toJSON = function() {
    // TODO: implement
    return "";
};

GameObject.prototype.unload = function () {

};

