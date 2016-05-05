/**
 * GameScene class
 */
function GameScene(params) {
    params = params || {};

    // public properties:

    this.name = params.name || "GameScene";

    // private properties:
    this._game = params.game || null;
    this._camera = new Camera2D(0, 0, this._game.getVirtualResolution().width, this._game.getVirtualResolution().height); // the default scene camera
    this._backgroundColor = params.backgroundColor || Color.CornflowerBlue;
    this._entities = [];
}

GameScene.prototype.getCamera = function() {
    return this._camera
};

GameScene.prototype.setGame = function(game) {
    this._game = game;
};

GameScene.prototype.getGame = function() {
    return this._game;
};

GameScene.prototype.setBackgroundColor = function(color) {
    this._backgroundColor = color;
};

GameScene.prototype.getBackgroundColor = function() {
    return this._backgroundColor;
};

GameScene.prototype.addEntity = function (entity) {
    this._entities.push(entity);
};

GameScene.prototype.removeEntity = function (entity) {
    // TODO: implement
};

GameScene.prototype.prepareRender = function() {
    var gl = this._game.getRenderContext().getContext();

    // set clear color and clear the screen:
    gl.clearColor(this._backgroundColor.r, this._backgroundColor.g, this._backgroundColor.b, this._backgroundColor.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

GameScene.prototype.sceneRender = function(delta) {
    // TODO: implement
};

GameScene.prototype.toJSON = function() {
    // TODO: implement
    return "";
};

GameScene.prototype.unload = function () {

};