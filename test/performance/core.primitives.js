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
let gameCamera;
let zoomVal = 1;
let gridExt;


gameScene.initialize = function () {
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

    gameCamera = game.getActiveCamera();
    gameCamera.x = (DISPLAY_WIDTH / 2);
    gameCamera.y = (DISPLAY_HEIGHT / 2);

    gridExt = new GridExt({game: game, gridSize: 6});
};

gameScene.update = function (delta) {
    meter.tick();

    gameCamera.zoom = Math.abs(Math.cos(zoomVal));
    zoomVal+=0.25*delta;
};

gameScene.lateRender = function (delta) {
    gridExt.render(delta);
};

game.changeScene(gameScene);



