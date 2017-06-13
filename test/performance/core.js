// performance tests...
let canvas;
let game = new Game({
    target: "canvas"
});

game.init();

let gameScene = new GameScene({
    name: "my game scene 1",
    game: game
});

let DISPLAY_WIDTH = 1920.0;
let DISPLAY_HEIGHT = 1080.0;
let spriteTex, spriteTex2, sprites = [];
let primitiveBatch;
let gameCamera;

ContentLoader.load({
    images: [
       {
            "path": "logo-white-bd-small.png",
            "alias": "sprite2"
        }
    ]
}).then(() => {
    game.changeScene(gameScene);

    primitiveBatch = new PrimitiveBatch(game);
});

gameScene.initialize = function () {
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

    gameCamera = game.getActiveCamera();
    gameCamera.x = (DISPLAY_WIDTH / 2);
    gameCamera.y = (DISPLAY_HEIGHT / 2);

    //spriteTex = new Texture2D(ContentLoader.getImage("sprite1"));
    spriteTex2 = new Texture2D(ContentLoader.getImage("sprite2"));

    for (let i = 0; i < 10000; i++) {
        let sprite = new Sprite({texture: spriteTex2 });
        sprite.transform.setScale(Math.random());
        sprite.transform.setPosition(80 + (Math.random() * DISPLAY_WIDTH) - 80, 80 + (Math.random() * DISPLAY_HEIGHT) - 80);
        //sprite.transform.setPosition(200, 200);
        sprite.rotateRate = Math.random() + 0.5;

        sprites.push(sprite)
    }

    console.log("size: " + sprites.length);
};

let zoomVal = 1;
gameScene.update = function (delta) {
    meter.tick();

    //sprites.forEach((sprite) => {
    //    sprite.transform.rotate(1 * delta * sprite.rotateRate);
    //});

    //gameCamera.zoom = Math.cos(zoomVal);
    zoomVal += 0.25 * delta;
};

gameScene.lateRender = function (delta) {
    sprites.forEach((sprite) => {
        this._spriteBatch.storeSprite(sprite);
    });

    //primitiveBatch.begin();
    //primitiveBatch.storeLine({x: -100, y: 100}, {x: 100, y: 100}, Color.Red);
    //primitiveBatch.flushLines();
};




