var DISPLAY_WIDTH = 1280;
var DISPLAY_HEIGHT = 720;

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
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);
});

gameScene.initialize = function() {
    var playerTex = new Texture2D(ContentLoader.getImage("player"));
    var player = new Sprite({texture: playerTex});
    player.transform.setPosition(0, 300);
    player.transform.setScale(0.25);
    sc.assignScript("playerInput", player);
    gameScene.addGameObject(player);
};

gameScene.lateUpdate = function (delta) {
    // show fps UI "tick"
    meter.tick();
};