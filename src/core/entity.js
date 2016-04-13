/**
 * Transform class
 */
var Entity = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Entity(params) {
        params = params || {};

        // public properties:


        // private properties:
        _this.parent = params.parent;
    }

    Entity.prototype.toJSON = function() {
        // TODO: implement
        return "";
    };

    Entity.prototype.unload = function () {
        _this = null;
    };

    return Entity;

})();