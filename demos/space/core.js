var DISPLAY_WIDTH = 1280;
var DISPLAY_HEIGHT = 720;

var canvas;
var game = new Game({target: "canvas"});
game.init();

var gameScene = new GameScene({
    name: "my game scene 1",
    game: game,
    backgroundColor: Color.Black
});

ContentLoader.load({
    images: [
        { path: "assets/player.png", alias: "player" },
        { path: "assets/enemy_1.png", alias: "enemy1" },
        { path: "assets/enemy_2.png", alias: "enemy2" }
    ]
}).then(function(result) {
    game.changeScene(gameScene);
});

gameScene.initialize = function() {
    var playerTex = new Texture2D(ContentLoader.getImage("player"));
    var player = new Sprite({texture: playerTex});
    gameScene.addGameObject(player);
};
