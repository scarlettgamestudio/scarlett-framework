/**
 * Transform class
 */
function Transform(params) {
    params = params || {};

    // public properties:


    // private properties:
    this.parent = params._parent;

}

Transform.prototype.toJSON = function() {
    // TODO: implement
    return "";
};

Transform.prototype.unload = function () {

};
