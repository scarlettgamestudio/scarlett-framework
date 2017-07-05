let canvas;
let game = new SC.Game({
  target: "canvas"
});

game.init();

let gameScene = new SC.GameScene({
  name: "my game scene 1",
  game: game
});

let DISPLAY_WIDTH = 1280;
let DISPLAY_HEIGHT = 720;
let primitiveBatch = new SC.PrimitiveBatch(game);
let gridExt = new SC.GridExtension({ game: game });
let drawCount = 2000;
let colorPool = [];

for (let i = 0; i < drawCount * 2; i++) {
  colorPool[i] = SC.Color.random();
}

gridExt.setGridColor(SC.Color.Blue);

game.addRenderExtension("GRID_EXT", gridExt);
game.changeScene(gameScene);
game.getActiveCamera().x = DISPLAY_WIDTH / 2;
game.getActiveCamera().y = DISPLAY_HEIGHT / 2;

gameScene.initialize = function() {
  game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);
};

gameScene.update = function(delta) {
  meter.tick();
};

let colorSpring = 0;

gameScene.lateRender = function(delta) {
  /*primitiveBatch.begin();

  for (var i = 0; i < drawCount; i++) {
    primitiveBatch.storeRectangle(new SC.Rectangle(i, i, 100, 100), colorPool[i]);
    primitiveBatch.storeLine({ x: 0, y: i }, { x: DISPLAY_WIDTH, y: i }, colorPool[i], colorPool[drawCount - i]);
  }

  primitiveBatch.flush();*/
};
