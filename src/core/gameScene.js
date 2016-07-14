/**
 * GameScene class
 */
function GameScene(params) {
	params = params || {};

	if(!params.game) {
		throw "cannot create a game scene without the game parameter";
	}

	// public properties:

	this.name = params.name || "GameScene";

	// private properties:
	this._game = params.game || null;
	this._camera = new Camera2D(0, 0, this._game.getVirtualResolution().width, this._game.getVirtualResolution().height); // the default scene camera
	this._backgroundColor = params.backgroundColor || Color.CornflowerBlue;
	this._gameObjects = [];
	this._spriteBatch = new SpriteBatch(params.game);
}

GameScene.prototype.getPhysicsWorld = function () {
	return this._game.getPhysicsEngine().world;
};

GameScene.prototype.getCamera = function () {
	return this._camera
};

GameScene.prototype.setGame = function (game) {
	this._game = game;
};

GameScene.prototype.getGame = function () {
	return this._game;
};

GameScene.prototype.setBackgroundColor = function (color) {
	this._backgroundColor = color;
};

GameScene.prototype.getBackgroundColor = function () {
	return this._backgroundColor;
};

GameScene.prototype.addGameObject = function (entity) {
	this._gameObjects.push(entity);
};

GameScene.prototype.getGameObjects = function() {
	return this._gameObjects;
};

GameScene.prototype.removeEntity = function (entity) {
	// TODO: implement
};

GameScene.prototype.prepareRender = function () {
	var gl = this._game.getRenderContext().getContext();

	// set clear color and clear the screen:
	gl.clearColor(this._backgroundColor.r, this._backgroundColor.g, this._backgroundColor.b, this._backgroundColor.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
};

GameScene.prototype.sceneLateUpdate = function (delta) {
	Matter.Engine.update(this._game.getPhysicsEngine(), 1000 / 60);
};

GameScene.prototype.sceneRender = function (delta) {
	// let's render all game objects on scene:
	for(var i = 0; i < this._gameObjects.length; i++) {
		this._gameObjects[i].render(delta, this._spriteBatch);
	}

	// all draw data was stored, now let's actually render stuff into the screen!
	this._spriteBatch.flush();
};

GameScene.prototype.toJSON = function () {
	// TODO: implement
	return "";
};

GameScene.prototype.unload = function () {

};