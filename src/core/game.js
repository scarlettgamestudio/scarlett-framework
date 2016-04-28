/**
 * GameScene class
 */
var Game = (function () {

    var DEFAULT_VIRTUAL_WIDTH = 800,
        DEFAULT_VIRTUAL_HEIGHT = 640;

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
        _this.virtualResolution = null;

        // set the default virtual resolution
        this.setVirtualResolution(DEFAULT_VIRTUAL_WIDTH, DEFAULT_VIRTUAL_HEIGHT);

        // the target container is defined?
        if (isString(params.target)) {
            this.setTarget(params.target);
        }
    }

    /**
     *
     * @param timestamp
     */
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

            _this.gameScene.prepareRender();

            // the user defined the game scene pre-render function?
            if(isFunction(_this.gameScene.preRender)) {
                _this.gameScene.preRender(delta);
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

    Game.prototype.setVirtualResolution = function (width, height) {
        _this.virtualResolution = {
            width: width,
            height: height
        };

        if(isObjectAssigned(_this.renderContext)) {
            _this.renderContext.setVirtualResolution(width, height);
        }
    };

    Game.prototype.refreshVirtualResolution = function () {
      _this.renderContext.setVirtualResolution(_this.virtualResolution.width, _this.virtualResolution.height);
    };

    Game.prototype.getVirtualResolution = function () {
        return _this.virtualResolution;
    };

    Game.prototype.getRenderContext = function () {
        return _this.renderContext;
    };

    Game.prototype.setTarget = function (target) {
        _this.canvas = isString(target) ? document.getElementById(target) : null;

        if (isObjectAssigned(_this.canvas)) {
            // OPTIONAL: for now there is only WebGL Context, add more if needed:
            // assign the render context..
            _this.renderContext = new WebGLContext({
                renderContainer: _this.canvas
            });

            // setting the global active render as the one selected for this game:
            GameManager.renderContext = _this.renderContext;

            this.refreshVirtualResolution();
        }
    };

    Game.prototype.changeScene = function (scene) {
        if (isGameScene(scene)) {
            if (isGameScene(_this.gameScene)) {
                // unload the active scene:
                _this.gameScene.unload();
            }

            _this.gameScene = scene;
            _this.gameScene.setGame(this);

            // the user defined the game scene initialize function?
            if (isFunction(_this.gameScene.initialize)) {
                // call user defined update function:
                _this.gameScene.initialize();
            }
        }
    };

    Game.prototype.getTotalElapsedTime = function () {
        return _this.totalElapsedTime;
    };

    Game.prototype.unload = function () {
        _this = null;
    };

    return Game;

})();