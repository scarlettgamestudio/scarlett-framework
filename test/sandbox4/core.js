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
var gl = null;
var spriteBatch = null;

var tex = new Texture2D("./sprite.png");


var sprites = [];



gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    spriteBatch = new SpriteBatch(game);

    var bWidth = 23, bHeight = 23;
    var bCountX = parseInt(displayWidth / bWidth);
    var bCountY = parseInt(displayHeight / bHeight);
    console.log(bCountX * bCountY);
    for(var i = 0; i < bCountX; i++) {
        for(var j = 0; j < bCountY; j++) {
            var sprite = new Sprite({
                texture: tex
            });

            sprite.transform.setPosition(i * bWidth - halfWidth, j * bHeight - halfHeight);
            sprite.transform.setScale(1.0 / (bCountX / 3), 1.0 / (bCountY / 3));

            sprites.push(sprite);
        }
    }
};

gameScene.update = function (delta) {

};

gameScene.lateRender = function (delta) {

    for(var i = 0; i < sprites.length; i++) {
        spriteBatch.storeSprite(sprites[i]);
    }

    spriteBatch.flush();


    meter.tick();
};

game.changeScene(gameScene);



