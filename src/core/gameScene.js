/**
 * GameScene class
 */
var GameScene = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function GameScene(params) {
        params = params || {};

        // public properties:

        this.name = params.name || "GameScene";

        // private properties:

        _this.entities = [];
    }

    GameScene.prototype.addEntity = function (entity) {
        _this.entities.push(entity);
    };

    GameScene.prototype.removeEntity = function (entity) {
        // TODO: implement
    };

    GameScene.prototype.render = function(delta) {
        // TODO: implement
    };

    GameScene.prototype.toJSON = function() {
        // TODO: implement
        return "";
    };

    GameScene.prototype.unload = function () {
        _this = null;
    };

    return GameScene;

})();