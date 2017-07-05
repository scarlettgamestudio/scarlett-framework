var settings = {
  target: "canvas"
};

var Game = SC.Game;
var GameScene = SC.GameScene;
var Color = SC.Color;
var Rectangle = SC.Rectangle;
var PrimitiveRender = SC.PrimitiveRender;
var PrimitiveBatch = SC.PrimitiveBatch;

var canvas;

var game = new Game(settings);
game.init();

var gameScene = new GameScene({
  name: "my game scene 1",
  game: game
});

var displayWidth = 1280.0;
var displayHeight = 720.0;
var halfWidth = displayWidth / 2;
var halfHeight = displayHeight / 2;
var primitiveRender = null;
var primitiveBatch = null;
var redColor = Color.Scarlet;
var greenColor = Color.fromRGBA(0, 255.0, 0.0, 1.0);
var coolColor = Color.fromRGB(31, 39, 38);
var py = 0;
var rect = new Rectangle(0, 0, 100, 100);

var lines = [];

gameScene.initialize = function() {
  game.setVirtualResolution(displayWidth, displayHeight);
  primitiveRender = new PrimitiveRender(game);
  primitiveBatch = new PrimitiveBatch(game);

  var gameCamera = game.getActiveCamera();
  gameCamera.x = 100;
};

gameScene.update = function(delta) {
  py += 0.05 * delta;
};

var gridSize = 32;

gameScene.lateRender = function(delta) {
  var howManyX = displayWidth / 32 + 10;
  var howManyY = displayHeight / 32 + 10;

  for (var x = 0; x < howManyX; x++) {
    primitiveRender.drawLine(
      { x: x * gridSize - displayWidth / 2, y: displayHeight / 2 },
      { x: x * gridSize - displayWidth / 2, y: -displayHeight / 2 },
      1,
      coolColor
    );
  }

  for (var y = 0; y < howManyY; y++) {
    primitiveRender.drawLine(
      { x: displayWidth / 2, y: y * gridSize - displayHeight / 2 },
      { x: -displayWidth / 2, y: y * gridSize - displayHeight / 2 },
      1,
      coolColor
    );
  }

  meter.tick();
};

game.changeScene(gameScene);
