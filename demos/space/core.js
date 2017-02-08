var DISPLAY_WIDTH = 1280, HALF_DISPLAY_WIDTH = DISPLAY_WIDTH / 2;
var DISPLAY_HEIGHT = 720, HALF_DISPLAY_HEIGHT = DISPLAY_HEIGHT / 2;
var ENEMY_BURST_DELAY = 5;

var game = new Game({target: "canvas"});
var player;
var playerTex, playerBulletTex, enemyTex1, enemyTex2, backgroundTex;
var lastBurst = ENEMY_BURST_DELAY / 2;
var enemies = [];
var text;
var textTexture;

game.init();

var gameScene = new GameScene({
    name: "my game scene 1",
    game: game,
    backgroundColor: Color.fromRGB(29, 25, 35)
});

ContentLoader.load({
    images: [
        {path: "assets/player.png", alias: "player"},
        {path: "assets/player_bullet1.png", alias: "playerBullet"},
        {path: "assets/enemy_1.png", alias: "enemy1"},
        {path: "assets/enemy_2.png", alias: "enemy2"},
        {path: "assets/fnt/open-sans-sdf.png", alias: "fontBitmap"},
        {path: "assets/background.jpg", alias: "background"}
    ]
}).then(function (result) {
    game.changeScene(gameScene);
    game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);
});

gameScene.initialize = function () {
    playerTex = new Texture2D(ContentLoader.getImage("player"));
    playerBulletTex = new Texture2D(ContentLoader.getImage("playerBullet"));
    enemyTex1 = new Texture2D(ContentLoader.getImage("enemy1"));
    enemyTex2 = new Texture2D(ContentLoader.getImage("enemy2"));
    backgroundTex = new Texture2D(ContentLoader.getImage("background"));
    textTexture = new Texture2D(ContentLoader.getImage("fontBitmap"));

    var load = require('load-bmfont');

    load('assets/fnt/open-sans-sdf.fnt', function(err, font) {
        if (err)
            throw err;

        //The BMFont spec in JSON form
        /*console.log(font.common.lineHeight);
        console.log(font.info);
        console.log(font.chars);
        console.log(font.kernings);*/

        text = new Text({font: font, texture: textTexture, text: "Lorem ipsum\r\ndolore"});
        text.transform.setPosition(-300, -180);
        text.setColor(Color.fromRGBA(232,78,64, 1.0));

        // set initial text area value
        document.getElementById('str').value = text.getText();
        document.getElementById('stroke').value = text.getStroke().getSize();
        document.getElementById('dropShadow').value = text.getDropShadow().getSize();

        document.getElementById('scale').value = text.getFontSize();
        document.getElementById('gamma').value = text.getGamma();

        document.getElementById('letterSpacing').value = text.getLetterSpacing();

        document.getElementById('wordwrap').checked = text.getWordWrap();
        document.getElementById('charwrap').checked = text.getCharacterWrap();
        document.getElementById('debug').checked = text.getDebug();

        document.getElementById('alignLeft').checked = text.getAlign() == TextLayout.AlignType.LEFT;
        document.getElementById('alignCenter').checked = text.getAlign() == TextLayout.AlignType.CENTER;
        document.getElementById('alignRight').checked = text.getAlign() == TextLayout.AlignType.RIGHT;

    });


    var background = new Sprite({texture: backgroundTex});
    background.setWrapMode(WrapMode.REPEAT);
    sc.assignScript("backgroundAgent", background);
    //gameScene.addGameObject(background);

    player = new Sprite({texture: playerTex});
    player.transform.setPosition(-300, 0);
    player.transform.setScale(0.50);
    player.transform.setRotation(MathHelper.PI);
    sc.assignScript("playerInput", player);
    //gameScene.addGameObject(player);
    //gameScene.addGameObject(text);
};

document.getElementById('str').oninput = updateValues;
document.getElementById('stroke').oninput = updateValues;
document.getElementById('scale').oninput = updateValues;
document.getElementById('gamma').oninput = updateValues;
document.getElementById('letterSpacing').oninput = updateValues;
document.getElementById('wordwrap').onchange = updateValues;
document.getElementById('charwrap').onchange = updateValues;
document.getElementById('debug').onchange = updateValues;
document.getElementById('alignLeft').onchange = updateValues;
document.getElementById('alignCenter').onchange = updateValues;
document.getElementById('alignRight').onchange = updateValues;
document.getElementById('dropShadow').oninput = updateValues;

function updateValues()
{
    var str = document.getElementById('str').value;
    var stroke = +document.getElementById('stroke').value;

    var scale = +document.getElementById('scale').value;
    var gamma = +document.getElementById('gamma').value;
    var letterSpacing = +document.getElementById('letterSpacing').value;

    var dropShadowSmoothing = +document.getElementById('dropShadow').value;

    var wordWrap = +document.getElementById('wordwrap').checked;
    var charWrap = +document.getElementById('charwrap').checked;
    var debug = +document.getElementById('debug').checked;

    var align = +document.getElementById('alignLeft').checked ? TextLayout.AlignType.LEFT :
                            +document.getElementById('alignCenter').checked ? TextLayout.AlignType.CENTER : TextLayout.AlignType.RIGHT;

    text.setText(str);
    text.setGamma(gamma);
    text.setFontSize(scale);
    text.getStroke().setSize(stroke);
    text.getDropShadow().setSize(dropShadowSmoothing);
    text.setWordWrap(wordWrap);
    text.setCharacterWrap(charWrap);
    text.setDebug(debug);
    text.setAlign(align);
    text.setLetterSpacing(letterSpacing);
};

gameScene.lateUpdate = function (delta) {
    // show fps UI "tick"
    meter.tick();

    lastBurst += delta;
    if (lastBurst >= ENEMY_BURST_DELAY) {
        //this.dispatchEnemies();
        lastBurst = 0;
    }

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(delta);
    }

    if (Keyboard.isKeyDown(Keys.Add)){
        this._camera.zoom -= 0.01;
    } else if (Keyboard.isKeyDown(Keys.Subtract)){
        this._camera.zoom += 0.01;
    }

};

gameScene.lateRender = function (delta) {
    for (var i = 0; i < enemies.length; i++) {
        this._spriteBatch.storeSprite(enemies[i]);
    }

    if (text) {
        text.render(delta, this._spriteBatch);
    }
};

gameScene.dispatchEnemies = function () {
    var i, count = 5;
    for (i = 1; i <= count; i++) {
        var enemy = new Sprite({texture: enemyTex2});
        enemy.transform.setPosition(HALF_DISPLAY_WIDTH + i * 200, Math.random() * (DISPLAY_HEIGHT - 100) - (HALF_DISPLAY_HEIGHT - 100));
        enemy.transform.setScale(0.60);
        enemy.transform.lookAt(player.transform.getPosition());
        //enemy.transform.setRotation(-MathHelper.PIo2);
        sc.assignScript("enemyAgent", enemy);

        enemies.push(enemy);
    }

};