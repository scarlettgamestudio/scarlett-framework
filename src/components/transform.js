/**
 * Transform class
 */
var Transform = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Transform(params) {
        params = params || {};

        // public properties:


        // private properties:
        _this.parent = params.parent;
    }
    
    Transform.prototype.toJSON = function() {
        // TODO: implement
        return "";
    };

    Transform.prototype.unload = function () {
        _this = null;
    };

    return Transform;

})();