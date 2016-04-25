var img = ImageLoader.loadImage("sprite.png", function (response) {
   // alert(response.isSuccessful());
});
img = ImageLoader.loadImage("sprite.png", function (response) {
    //alert(response.isSuccessful());
});


var settings = {
    target: "canvas"
};

var game = new Game(settings);
game.init();

var gameScene = new GameScene({
   name: "my game scene 1"
});

gameScene.update = function(delta) {
    // do stuff here:
    console.log("hello " + this.name);
};

game.changeScene(gameScene);



