/**
 * GameScene class
 */
var Game = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Game(params) {
        params = params || {};

        // public properties:


        // private properties:
        _this.initialized = false;
        _this.canvas = isString(params.target) ? document.getElementById(params.id) : null;
        _this.gameScene = params.scene;
        _this.totalElapsedTime = null;
    }

    function onAnimationFrame(timestamp) {
        // is this the first run?
        if (_this.totalElapsedTime === null) {
            _this.totalElapsedTime = timestamp;
        }

        // calculate the current delta time value:
        var delta = timestamp - _this.totalElapsedTime;
        _this.totalElapsedTime = timestamp;

        if(isGameScene(_this.gameScene)) {
            // handle the active game scene interactions here:

            // the user defined the game scene update function?
            if(isFunction(_this.gameScene.update)) {
                // call user defined update function:
                _this.gameScene.update(delta);
            }

            // call internal scene render function:
            _this.gameScene.render(delta);
        }

        // still active?
        if (_this !== null) {
            // request a new animation frame:
            requestAnimationFrame(onAnimationFrame);
        }
    }

    Game.prototype.init = function () {
        // context initialization


        // start the internal render update notice
        requestAnimationFrame(onAnimationFrame);

        _this.initalized = true;
    };
    
    Game.prototype.changeScene = function(scene) {
        if(isGameScene(_this.gameScene)) {
            // unload the active scene:
            _this.gameScene.unload();
        }

        _this.gameScene = scene;
    };

    Game.prototype.getTotalElapsedTime = function() {
      return _this.totalElapsedTime;
    };

    Game.prototype.unload = function () {
        _this = null;
    };

    return Game;

})();