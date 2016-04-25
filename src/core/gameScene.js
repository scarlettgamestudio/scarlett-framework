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

        _this.game = params.game || null;
        _this.backgroundColor = new Color();
        _this.entities = [];
    }

    GameScene.prototype.setGame = function(game) {
        _this.game = game;
    };

    GameScene.prototype.getGame = function() {
      return _this.game;
    };

    GameScene.prototype.setBackgroundColor = function(color) {
      _this.backgroundColor = color;
    };

    GameScene.prototype.getBackgroundColor = function() {
      return _this.backgroundColor;
    };

    GameScene.prototype.addEntity = function (entity) {
        _this.entities.push(entity);
    };

    GameScene.prototype.removeEntity = function (entity) {
        // TODO: implement
    };

    GameScene.prototype.render = function(delta) {
        // background color:
        var gl = _this.game.getRenderContext().getContext();
        gl.clearColor(_this.backgroundColor.r, _this.backgroundColor.g, _this.backgroundColor.b, _this.backgroundColor.a);
        gl.clear(gl.COLOR_BUFFER_BIT);

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