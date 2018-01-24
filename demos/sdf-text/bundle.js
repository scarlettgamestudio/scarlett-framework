(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DISPLAY_WIDTH = 1280,
  HALF_DISPLAY_WIDTH = DISPLAY_WIDTH / 2;
var DISPLAY_HEIGHT = 720,
  HALF_DISPLAY_HEIGHT = DISPLAY_HEIGHT / 2;
var ENEMY_BURST_DELAY = 5;

//const OpenTypeBmFont = require("opentype-bmfont");
//let BmFont = new OpenTypeBmFont();

var Game = SC.Game;
var GameScene = SC.GameScene;
var ContentLoader = SC.ContentLoader;
var GameManager = SC.GameManager;
var Sprite = SC.Sprite;
var WrapMode = SC.WrapMode;
var Texture2D = SC.Texture2D;
var Text = SC.Text;
var Color = SC.Color;
var Keyboard = SC.Keyboard;
var Keys = SC.Keys;
var Vector2 = SC.Vector2;
var MathHelper = SC.MathHelper;
var BMFontParser = SC.BMFontParser;
var FileContext = SC.FileContext;
var FontLoader = SC.FontLoader;
var Path = SC.Path;

var game = new Game({ target: "canvas" });
var player;
var playerTex, playerBulletTex, enemyTex1, enemyTex2, backgroundTex;
var lastBurst = ENEMY_BURST_DELAY / 2;
var enemies = [];
var text;
var textTexture;
var newText;

game.init();

var gameScene = new GameScene({
  name: "my game scene 1",
  game: game,
  backgroundColor: Color.fromRGB(29, 25, 35)
});

GameManager.activeProjectPath = "http://localhost:8080/demos/sdf-text/";

ContentLoader.loadAll({
  images: [
    { path: "assets/player.png", alias: "player" },
    { path: "assets/player_bullet1.png", alias: "playerBullet" },
    { path: "assets/enemy_1.png", alias: "enemy1" },
    { path: "assets/enemy_2.png", alias: "enemy2" },
    { path: "assets/fnt/open-sans-sdf.png", alias: "fontBitmap" },
    { path: "assets/background.jpg", alias: "background" }
  ],
  files: [{ path: "assets/fnt/open-sans-sdf.fnt", alias: "openSansFont" }]
}).then(async function(result) {
  var images = result[0];
  var files = result[1];
  var audios = result[2];

  //ContentLoader.loadFile("assets/fnt/open-sans-sdf.fnt");
  // map doesn't work on internet explorer... :D
  /* 
    images.map(image => {
      console.log(image.alias);
    });
    files.map(file => {
      console.log(file);
    });
    audios.map(audio => {
      console.log(audio.alias);
    });
  */

  //const exists = await FontLoader.loadFontAsync("assets/fnt/OpenSans-Regular.ttf");

  //console.log(exists);

  // needs to come before initializeTexDependencies
  game.changeScene(gameScene);
  game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

  await initializeTextDependencies("assets/fnt/OpenSans-Regular.ttf");

  // either BMFontParser.parse(files[0]);
  // or BMFontParser.parse(ContentLoader.getFile("openSansFont"))

  /*
  await BmFont.createBitmap("assets/fnt/OpenSans-Regular.ttf", {}, function(err, result) {
    if (err != null) {
      return;
    }

    let textTexture = new Texture2D(result.JSON.pages[0]);

    //var font = new Sprite({ texture: textTexture });
    //font.transform.setPosition(0, 200);
    //gameScene.addGameObject(font);

    var parsedBMFont = result.JSON; //BMFontParser.parse(filecontextobj);

    initializeTextDependencies(parsedBMFont, textTexture);
  }); */
});

gameScene.initialize = function() {
  playerTex = new Texture2D(ContentLoader.getImage("player"));
  playerBulletTex = new Texture2D(ContentLoader.getImage("playerBullet"));
  enemyTex1 = new Texture2D(ContentLoader.getImage("enemy1"));
  enemyTex2 = new Texture2D(ContentLoader.getImage("enemy2"));
  backgroundTex = new Texture2D(ContentLoader.getImage("background"));
  textTexture = new Texture2D(ContentLoader.getImage("fontBitmap"));

  var background = new Sprite({ texture: backgroundTex });
  background.setWrapMode(WrapMode.REPEAT);
  //SC.assignScript("backgroundAgent", background);
  //gameScene.addGameObject(background);

  player = new Sprite({ texture: playerTex });
  player.transform.setPosition(-300, 0);
  player.transform.setScale(0.5);
  player.transform.setRotation(MathHelper.PI);
  //SC.assignScript("playerInput", player);
  //gameScene.addGameObject(player);
  //gameScene.addGameObject(text);
};

async function initializeTextDependencies(fontPath) {
  //The BMFont spec in JSON form
  /*console.log(fontDescription.common.lineHeight);
     console.log(fontDescription.info);
     console.log(fontDescription.chars);
     console.log(fontDescription.kernings);*/

  text = new Text({
    fontFilePath: fontPath,
    text: "Lorem\r\nipsum\r\ndolore"
  });

  if (await text.setFontFilePathAsync(fontPath)) {
    text.transform.setPosition(-300, -180);
    text.setColor(Color.fromRGBA(232, 78, 64, 1.0));

    //var data = text.objectify();

    //console.log(data);

    //text.unload();

    //Text.restore(data).then(restoredText => {
    newText = text;

    // set initial text area value
    document.getElementById("str").value = newText.getText();
    document.getElementById("stroke").value = newText.getStroke().getSize();
    document.getElementById("dropShadow").value = newText
      .getDropShadow()
      .getStroke()
      .getSize();
    document.getElementById("dropShadowOffsetX").value = newText.getDropShadow().getOffset().x;
    document.getElementById("dropShadowOffsetY").value = newText.getDropShadow().getOffset().y;

    document.getElementById("scale").value = newText.getFontSize();
    document.getElementById("gamma").value = newText.getGamma();

    document.getElementById("letterSpacing").value = newText.getLetterSpacing();

    document.getElementById("wordwrap").checked = newText.getWordWrap();
    document.getElementById("charwrap").checked = newText.getCharacterWrap();
    document.getElementById("debug").checked = newText.getDebug();
    document.getElementById("dropShadowEnabled").checked = newText.getDropShadowEnabled();
    document.getElementById("outlineEnabled").checked = newText.getStrokeEnabled();

    document.getElementById("alignLeft").checked = newText.getAlign() == Text.AlignType.LEFT;
    document.getElementById("alignCenter").checked = newText.getAlign() == Text.AlignType.CENTER;
    document.getElementById("alignRight").checked = newText.getAlign() == Text.AlignType.RIGHT;
    //});
  }
}

document.getElementById("str").oninput = updateValues;
document.getElementById("stroke").oninput = updateValues;
document.getElementById("dropShadowOffsetX").oninput = updateValues;
document.getElementById("dropShadowOffsetY").oninput = updateValues;
document.getElementById("scale").oninput = updateValues;
document.getElementById("gamma").oninput = updateValues;
document.getElementById("letterSpacing").oninput = updateValues;
document.getElementById("wordwrap").onchange = updateValues;
document.getElementById("charwrap").onchange = updateValues;
document.getElementById("debug").onchange = updateValues;
document.getElementById("dropShadowEnabled").onchange = updateValues;
document.getElementById("outlineEnabled").onchange = updateValues;
document.getElementById("alignLeft").onchange = updateValues;
document.getElementById("alignCenter").onchange = updateValues;
document.getElementById("alignRight").onchange = updateValues;
document.getElementById("dropShadow").oninput = updateValues;

function updateValues() {
  var str = document.getElementById("str").value;
  var stroke = +document.getElementById("stroke").value;

  var dropshadowOffsetX = +document.getElementById("dropShadowOffsetX").value;
  var dropshadowOffsetY = +document.getElementById("dropShadowOffsetY").value;

  var scale = +document.getElementById("scale").value;
  var gamma = +document.getElementById("gamma").value;
  var letterSpacing = +document.getElementById("letterSpacing").value;

  var dropShadowSmoothing = +document.getElementById("dropShadow").value;

  var wordWrap = +document.getElementById("wordwrap").checked;
  var charWrap = +document.getElementById("charwrap").checked;
  var debug = +document.getElementById("debug").checked;

  var dropShadowEnabled = +document.getElementById("dropShadowEnabled").checked;

  var outlineEnabled = +document.getElementById("outlineEnabled").checked;

  var align = +document.getElementById("alignLeft").checked
    ? Text.AlignType.LEFT
    : +document.getElementById("alignCenter").checked ? Text.AlignType.CENTER : Text.AlignType.RIGHT;

  newText.setText(str);
  newText.setGamma(gamma);
  newText.setFontSize(scale);
  newText.getStroke().setSize(stroke);
  newText.getDropShadow().setOffset(new Vector2(dropshadowOffsetX, dropshadowOffsetY));
  newText
    .getDropShadow()
    .getStroke()
    .setSize(dropShadowSmoothing);
  newText.setWordWrap(wordWrap);
  newText.setCharacterWrap(charWrap);
  newText.setDebug(debug);
  newText.setDropShadowEnabled(dropShadowEnabled);
  newText.setStrokeEnabled(outlineEnabled);
  newText.setAlign(align);
  newText.setLetterSpacing(letterSpacing);
}

gameScene.lateUpdate = function(delta) {
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

  if (Keyboard.isKeyDown(Keys.Add)) {
    this._camera.zoom -= 0.01;
  } else if (Keyboard.isKeyDown(Keys.Subtract)) {
    this._camera.zoom += 0.01;
  }
};

gameScene.lateRender = function(delta) {
  for (var i = 0; i < enemies.length; i++) {
    this._spriteBatch.storeSprite(enemies[i]);
  }

  //if (text) {
  //    text.render(delta, this._spriteBatch);
  //}
  if (newText) {
    newText.render(delta, this._spriteBatch);
  }
};

gameScene.dispatchEnemies = function() {
  var i,
    count = 5;
  for (i = 1; i <= count; i++) {
    var enemy = new Sprite({ texture: enemyTex2 });
    enemy.transform.setPosition(
      HALF_DISPLAY_WIDTH + i * 200,
      Math.random() * (DISPLAY_HEIGHT - 100) - (HALF_DISPLAY_HEIGHT - 100)
    );
    enemy.transform.setScale(0.6);
    enemy.transform.lookAt(player.transform.getPosition());
    //enemy.transform.setRotation(-MathHelper.PIo2);
    //sc.assignScript("enemyAgent", enemy);

    enemies.push(enemy);
  }
};

},{}]},{},[1]);
