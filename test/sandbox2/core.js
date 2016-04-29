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

var displayWidth = 640;
var displayHeight = 360;
var primitiveRender = null;
var redColor = Color.Scarlet;
var greenColor = Color.fromRGBA(0, 255.0, 0.0, 1.0);
var py = 0;
var rect = new Rectangle(0, 0, 100, 100);

gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    primitiveRender = new PrimitiveRender(game);
};

gameScene.update = function (delta) {
    py += 0.05 * delta;
};

gameScene.lateRender = function (delta) {

    primitiveRender.drawRectangle(rect, redColor);

    for (var i = 0; i < 10; i++) {
        primitiveRender.drawLine(new Vector2(-displayWidth / 2.0, -displayHeight / 2.0 + (i * 5) + py), new Vector2(displayWidth / 2.0, 0), 4, i % 2 == 0 ? redColor : greenColor);
        //primitiveRender.drawPoint(new Vector2(-displayWidth / 2.0, -displayHeight / 2.0 + (i * 5) + py), 10, redColor);
    }
};

game.changeScene(gameScene);



