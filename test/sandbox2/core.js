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

var displayWidth = 1280.0;
var displayHeight = 720.0;
var halfWidth = displayWidth / 2;
var halfHeight = displayHeight / 2;
var primitiveRender = null;
var primitiveBatch = null;
var redColor = Color.Scarlet;
var greenColor = Color.fromRGBA(0, 255.0, 0.0, 1.0);
var py = 0;
var rect = new Rectangle(0, 0, 100, 100);
var boxes = [];

gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    primitiveRender = new PrimitiveRender(game);
    primitiveBatch = new PrimitiveBatch(game);

    var bWidth = 10.0, bHeight = 8.0;
    var bCountX = parseInt(displayWidth / bWidth);
    var bCountY = parseInt(displayHeight / bHeight);
    console.log(bCountX * bCountY);
    for(var i = 0; i < bCountX; i++) {
        for(var j = 0; j < bCountY; j++) {
            boxes.push({
                color: Color.random(),
                rectangle: new Rectangle(i * bWidth - halfWidth, j * bHeight - halfHeight, bWidth, bHeight)
            });
        }
    }
};

gameScene.update = function (delta) {
    py += 0.05 * delta;
};

var useBatch = true;

gameScene.lateRender = function (delta) {
    if(useBatch) {
        primitiveBatch.begin();
        for(var i = 0; i < boxes.length; i++) {
            primitiveBatch.storeRectangle(boxes[i].rectangle, Color.random());
        }
        primitiveBatch.flush();
    } else {
        for(var i = 0; i < boxes.length; i++) {
            primitiveRender.drawRectangle(boxes[i].rectangle, Color.random());
           // primitiveRender.drawPoint({x: 0, y: 0}, 5, Color.random());
        }
    }

    meter.tick();


    /*primitiveRender.drawRectangle(rect, redColor);

    for (var i = 0; i < 10; i++) {
        primitiveRender.drawLine(new Vector2(-displayWidth / 2.0, -displayHeight / 2.0 + (i * 5) + py), new Vector2(displayWidth / 2.0, 0), 4, i % 2 == 0 ? redColor : greenColor);
        //primitiveRender.drawPoint(new Vector2(-displayWidth / 2.0, -displayHeight / 2.0 + (i * 5) + py), 10, redColor);
    }*/
};

game.changeScene(gameScene);



