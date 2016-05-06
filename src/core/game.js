/**
 * GameScene class
 */
function Game(params) {
    params = params || {};

    var DEFAULT_VIRTUAL_WIDTH = 800,
        DEFAULT_VIRTUAL_HEIGHT = 640;
    
    // public properties:


    // private properties:
    this._renderContext = null;
    this._logger = new Logger(arguments.callee.name);
    this._initialized = false;
    this._gameScene = params.scene;
    this._totalElapsedTime = null;
    this._virtualResolution = null;
    this._shaderManager = null;
    this._executionPhase = SCARLETT.EXECUTION_PHASES.WAITING;
    this._physicsEngine = Matter.Engine.create();
    this._physicsEngine.enableSleeping = true;
    Matter.Engine.run(this._physicsEngine);

    // set the default virtual resolution
    this.setVirtualResolution(DEFAULT_VIRTUAL_WIDTH, DEFAULT_VIRTUAL_HEIGHT);

    // the target container is defined?
    if (isString(params.target)) {
        this.setTarget(params.target);
    }
}

/**
 * 
 * @returns {engine|*}
 */
Game.prototype.getPhysicsEngine = function () {
    return this._physicsEngine;
};

/**
 *
 * @param timestamp
 */
Game.prototype._onAnimationFrame = function(timestamp) {
    // is this the first run?
    if (this._totalElapsedTime === null) {
        this._totalElapsedTime = timestamp;
    }

    // calculate the current delta time value:
    var delta = timestamp - this._totalElapsedTime;
    this._totalElapsedTime = timestamp;

    if (isGameScene(this._gameScene)) {
        // handle the active game scene interactions here:

        // the user defined the game scene update function?
        if (isFunction(this._gameScene.update)) {
            // call user defined update function:
            this._executionPhase = SC.EXECUTION_PHASES.UPDATE;
            this._gameScene.update(delta);
        }

        if (isFunction(this._gameScene.lateUpdate)) {
            // call user defined update function:
            this._executionPhase = SC.EXECUTION_PHASES.LATE_UPDATE;
            this._gameScene.lateUpdate(delta);
        }

        this._gameScene.sceneLateUpdate(delta);

        // prepare the webgl context for rendering:
        this._gameScene.prepareRender();

        // the user defined the game scene early-render function?
        if(isFunction(this._gameScene.render)) {
            this._executionPhase = SC.EXECUTION_PHASES.RENDER;
            this._gameScene.render(delta);
        }

        // call internal scene render function:
        this._executionPhase = SC.EXECUTION_PHASES.SCENE_RENDER;
        this._gameScene.sceneRender(delta);

        // the user defined the game scene pre-render function?
        if(isFunction(this._gameScene.lateRender)) {
            this._executionPhase = SC.EXECUTION_PHASES.LATE_RENDER;
            this._gameScene.lateRender(delta);
        }

        this._executionPhase = SC.EXECUTION_PHASES.WAITING;
    }

    // request a new animation frame:
    requestAnimationFrame(this._onAnimationFrame.bind(this));
};

Game.prototype.getShaderManager = function() {
    return this._shaderManager;
};

Game.prototype.getActiveCamera = function() {
    return this._gameScene.getCamera();
};

Game.prototype.getExecutionPhase = function() {
    return this._executionPhase;
};

Game.prototype.init = function () {
    // context initialization
    if (!isObjectAssigned(this._canvas)) {
        this._logger.warn("Cannot initialize game, the render display target was not provided or is invalid.");
        return;
    }

    // request to begin the animation frame handling
    this._onAnimationFrame(0);

    this._initalized = true;
};

Game.prototype.setVirtualResolution = function (width, height) {
    this._virtualResolution = {
        width: width,
        height: height
    };

    if(isObjectAssigned(this._renderContext)) {
        this._renderContext.setVirtualResolution(width, height);

        // update camera view size:
        this.getActiveCamera().setViewSize(width, height);
    }
};

Game.prototype.refreshVirtualResolution = function () {
    this._renderContext.setVirtualResolution(this._virtualResolution.width, this._virtualResolution.height);
};

Game.prototype.getVirtualResolution = function () {
    return this._virtualResolution;
};

Game.prototype.getRenderContext = function () {
    return this._renderContext;
};

Game.prototype.setTarget = function (target) {
    this._canvas = isString(target) ? document.getElementById(target) : null;

    if (isObjectAssigned(this._canvas)) {
        // OPTIONAL: for now there is only WebGL Context, add more if needed:
        // assign the render context..
        this._renderContext = new WebGLContext({
            renderContainer: this._canvas
        });

        // setting the global active render as the one selected for this game:
        GameManager.renderContext = this._renderContext;
        this._shaderManager = new ShaderManager(this);

        this.refreshVirtualResolution();
    }
};

Game.prototype.changeScene = function (scene) {
    if (isGameScene(scene)) {
        if (isGameScene(this._gameScene)) {
            // unload the active scene:
            this._gameScene.unload();
        }

        this._gameScene = scene;
        this._gameScene.setGame(this);

        GameManager.activeScene = scene;

        // the user defined the game scene initialize function?
        if (isFunction(this._gameScene.initialize)) {
            // call user defined update function:
            this._gameScene.initialize();
        }
    }
};

Game.prototype.getTotalElapsedTime = function () {
    return this._totalElapsedTime;
};

Game.prototype.unload = function () {
};