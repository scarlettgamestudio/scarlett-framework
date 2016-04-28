var settings = {
    target: "canvas"
};

var canvas;

var game = new Game(settings);
game.init();

var gameScene = new GameScene({
    name: "my game scene 1",
    game: game
});

var displayWidth = 1280;
var displayHeight = 720;
var primitiveRender = null;
var redColor = Color.fromRGBA(255, 0.0, 0.0, 1.0);

gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    primitiveRender = new PrimitiveRender(game);
};

gameScene.lateRender = function (delta) {
    for(var i = 0; i < 80; i++) {
        primitiveRender.drawLine(new Vector2(-displayWidth / 2.0 , -displayHeight / 2.0 + (i * 21)), new Vector2(displayWidth / 2.0, 0), 20, redColor);
    }
};

game.changeScene(gameScene);



