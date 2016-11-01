var DISPLAY_WIDTH = 1280;
var DISPLAY_HEIGHT = 720;

var canvas;
var primitiveRender;
var game = new Game({target: "canvas"});
game.init();

var gameScene = new GameScene({
    name: "my game scene 1",
    game: game
});

var texture;
Texture2D.fromPath("./spriteBox.png").then(
    function (texture2D) {
        texture = texture2D;
        game.changeScene(gameScene);
    });

gameScene.initialize = function () {
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    var sprite = new Sprite({texture: texture});
    this.addGameObject(sprite);

    Scripts.generateComponent("simpleMovement", sprite);

    //game.addRenderExtension("GRID", new GridExt({game: game}));

    primitiveRender = new PrimitiveRender(game);
};

gameScene.lateUpdate = function (delta) {
    // show fps UI "tick"
    meter.tick();
};

gameScene.render = function() {
    primitiveRender.drawCircle({x: 20, y: 30}, 30, 8, Color.Black);
};


//var a = Scripts.generateComponent("simpleMovement", objectA);
//a.update(1);

//console.log(a);