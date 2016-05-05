/**
 * Entity class
 */
function Entity(params) {
    params = params || {};

    // public properties:


    // private properties:
    this.parent = params.parent;
}

// functions:
Entity.prototype.toJSON = function() {
    // TODO: implement
    return "";
};

Entity.prototype.unload = function () {

};

