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

let DISPLAY_WIDTH = 1280.0;
let DISPLAY_HEIGHT = 720.0;
let spriteTex, sprites = [];
let spriteBatch;
let gameCamera;

ContentLoader.load({
    images: [
        {
            "path": "logo-white-bd-small.png",
            "alias": "sprite1"
        }
    ]
}).then(() => {
    game.changeScene(gameScene);
});

gameScene.initialize = function () {
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

    gameCamera = game.getActiveCamera();
    gameCamera.x = (DISPLAY_WIDTH / 2);
    gameCamera.y = (DISPLAY_HEIGHT / 2);

    spriteTex = new Texture2D(ContentLoader.getImage("sprite1"));

    for (let i = 0; i < 5000; i++) {
        let sprite = new Sprite({texture: spriteTex});
        sprite.transform.setScale(Math.random());
        sprite.transform.setPosition(80 + (Math.random() * DISPLAY_WIDTH) - 80, 80 + (Math.random() * DISPLAY_HEIGHT) - 80);
        sprite.rotateRate = Math.random() + 0.5;

        sprites.push(sprite)
    }
};

let zoomVal = 1;
gameScene.update = function (delta) {
    meter.tick();

    sprites.forEach((sprite) => {
        sprite.transform.rotate(1 * delta * sprite.rotateRate);
    });

    gameCamera.zoom = Math.cos(zoomVal);
    zoomVal += 0.25 * delta;
};

gameScene.lateRender = function (delta) {
    sprites.forEach((sprite) => {
        this._spriteBatch.storeSprite(sprite);
    });
};




