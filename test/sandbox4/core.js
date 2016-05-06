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

var texA = new Texture2D("./spriteBox.png", function() {
    game.changeScene(gameScene);
});
var sprites = [];

gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);
    spriteBatch = new SpriteBatch(game);


    var ground = new GameObject();
    var rbody = new RigidBody({static:true});
    ground.addComponent(rbody);
    ground.transform.setPosition(0, halfHeight);
    ground.transform.setScale(1000, 20);


    var bWidth = 120, bHeight = 80;
    var bCountX = parseInt(displayWidth / bWidth);
    var bCountY = parseInt(displayHeight / bHeight);
    console.log(bCountX * bCountY);
    for(var i = 0; i < bCountX; i++) {
        for(var j = 0; j < bCountY; j++) {
            var rigidBody = new RigidBody({
                mass: 2.0,
                friction: 0.1
            });

            var sprite = new Sprite({
                texture: texA
            });

            sprite.transform.setPosition(i * bWidth - halfWidth + (bWidth / 2) * (i % 4 == 0 ? 1 : -1), j * bHeight - halfHeight);
            sprite.transform.setScale(1.0 / (bCountX / 4), 1.0 / (bCountY / 4));

            sprite.addComponent(rigidBody);

            //sprite.transform.setRotation(0.1);

            sprites.push(sprite);
        }
    }
};

gameScene.update = function (delta) {

};

gameScene.lateRender = function (delta) {

    for(var i = 0; i < sprites.length; i++) {
        //sprites[i].transform.setRotation( sprites[i].transform.getRotation() + 1 * delta / ((Math.random() * 600)) * ( i % 2 == 0 ? -1: 1));
        spriteBatch.storeSprite(sprites[i]);
    }

    spriteBatch.flush();


    meter.tick();
};



