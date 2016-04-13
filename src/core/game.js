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
        _this.renderContext = null;
        _this.logger = new Logger(arguments.callee.name);
        _this.initialized = false;
        _this.gameScene = params.scene;
        _this.totalElapsedTime = null;

        if (isString(params.target)) {
            this.setTarget(params.target);
        }
    }

    function onAnimationFrame(timestamp) {
        // is this the first run?
        if (_this.totalElapsedTime === null) {
            _this.totalElapsedTime = timestamp;
        }

        // calculate the current delta time value:
        var delta = timestamp - _this.totalElapsedTime;
        _this.totalElapsedTime = timestamp;

        if (isGameScene(_this.gameScene)) {
            // handle the active game scene interactions here:

            // the user defined the game scene update function?
            if (isFunction(_this.gameScene.update)) {
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
        if (!isObjectAssigned(_this.canvas)) {
            _this.logger.warn("Cannot initialize game, the render display target was not provided or is invalid.");
            return;
        }

        // request to begin the animation frame handling
        requestAnimationFrame(onAnimationFrame);

        _this.initalized = true;
    };

    Game.prototype.setTarget = function (target) {
        _this.canvas = isString(target) ? document.getElementById(target) : null;

        if (isObjectAssigned(_this.canvas)) {
            // assign the render context..
            _this.renderContext = new WebGLContext({
                renderContainer: _this.canvas
            });
        }
    };

    Game.prototype.changeScene = function (scene) {
        if (isGameScene(_this.gameScene)) {
            // unload the active scene:
            _this.gameScene.unload();
        }

        _this.gameScene = scene;
    };

    Game.prototype.getTotalElapsedTime = function () {
        return _this.totalElapsedTime;
    };

    Game.prototype.unload = function () {
        _this = null;
    };

    return Game;

})();