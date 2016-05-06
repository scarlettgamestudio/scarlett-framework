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

var texA = new Texture2D("./spriteA.png");
var texB = new Texture2D("./spriteB.png");

var sprites = [];



gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    spriteBatch = new SpriteBatch(game);

    var bWidth = 80, bHeight = 80;
    var bCountX = parseInt(displayWidth / bWidth);
    var bCountY = parseInt(displayHeight / bHeight);
    console.log(bCountX * bCountY);
    for(var i = 0; i < bCountX; i++) {
        for(var j = 0; j < bCountY; j++) {
            var sprite = new Sprite({
                texture: i % 2 == 0 ? texA : texB
            });

            sprite.transform.setPosition(i * bWidth - halfWidth, j * bHeight - halfHeight);
            sprite.transform.setScale(1.0 / (bCountX / 2), 1.0 / (bCountY / 2));
            //sprite.transform.setRotation(0.1);

            sprites.push(sprite);
        }
    }
};

gameScene.update = function (delta) {

};

gameScene.lateRender = function (delta) {

    for(var i = 0; i < sprites.length; i++) {
        sprites[i].transform.setRotation( sprites[i].transform.getRotation() + 1 * delta / 600 * ( i % 2 == 0 ? -1: 1));
        spriteBatch.storeSprite(sprites[i]);
    }

    spriteBatch.flush();


    meter.tick();
};

game.changeScene(gameScene);



