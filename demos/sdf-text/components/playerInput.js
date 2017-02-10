var DISPLAY_WIDTH = 1280, HALF_DISPLAY_WIDTH = DISPLAY_WIDTH / 2;
var DISPLAY_HEIGHT = 720, HALF_DISPLAY_HEIGHT = DISPLAY_HEIGHT / 2;
var ENEMY_BURST_DELAY = 5;

var OFFSET_BREAKPOINT = HALF_DISPLAY_WIDTH - 80;
var PLAYER_SHOOT_DELAY = 0.08;
var PLAYER_BULLET_SPEED = 580;
var script = sc.addScript("playerInput");

script.properties.add("strengthVertical", {
        default: 400
    }
);

script.properties.add("strengthHorizontal", {
        default: 200
    }
);

script.properties.add("fallback", {
        default: 125
    }
);

script.prototype.bullets = [];
script.prototype.shootElapsed = 0;

script.prototype.update = function (delta) {
    var directionHorizontal = 0;
    var directionVertical = 0;

    if (Keyboard.isKeyDown(Keys.RightArrow) || Keyboard.isKeyDown(Keys.D)) {
        directionHorizontal = 1;
    } else if (Keyboard.isKeyDown(Keys.LeftArrow) || Keyboard.isKeyDown(Keys.A)) {
        directionHorizontal = -1;
    }

    if (Keyboard.isKeyDown(Keys.UpArrow) || Keyboard.isKeyDown(Keys.W)) {
        directionVertical = -1;
    } else if (Keyboard.isKeyDown(Keys.DownArrow) || Keyboard.isKeyDown(Keys.S)) {
        directionVertical = 1;
    }

    if (Keyboard.isKeyDown(Keys.Enter) || Keyboard.isKeyDown(Keys.K) || Keyboard.isKeyDown(Keys.Space)) {
        this.shoot(delta);
    }

    this.gameObject.transform.translate(
        this.strengthHorizontal * directionHorizontal * delta,
        this.strengthVertical * directionVertical * delta);

    if (directionHorizontal == 0 && this.gameObject.transform.getPosition().x > -OFFSET_BREAKPOINT) {
        this.gameObject.transform.translate(this.fallback * delta * -1, 0);

        if (this.gameObject.transform.getPosition().x < -OFFSET_BREAKPOINT) {
            this.gameObject.transform.setPosition(-OFFSET_BREAKPOINT, this.gameObject.transform.getPosition().y);
        }
    }

    for (var i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].transform.translate(PLAYER_BULLET_SPEED * delta, 0);

        if (this.bullets[i].transform.getPosition().x > HALF_DISPLAY_WIDTH + 100) {
            this.bullets.splice(i, 1);
            console.log("bulletremoved!");
        }
    }

    this.shootElapsed += delta;
    //console.log(this.gameObject.transform.getPosition());
    //console.log(delta);
};

script.prototype.render = function (delta, spritebatch) {
    this.bullets.forEach(function (bullet) {
        spritebatch.storeSprite(bullet);
    });
};

script.prototype.shoot = function (delta) {
    if (this.shootElapsed > PLAYER_SHOOT_DELAY) {
        this.shootElapsed = 0;
    } else {
        return;
    }

    var bullet = new Sprite({texture: playerBulletTex});
    bullet.transform.setPosition(this.gameObject.transform.getPosition().x + 20, this.gameObject.transform.getPosition().y - 15);
    bullet.transform.setScale(0.5);
    bullet.transform.setRotation(MathHelper.PIo2);

    this.bullets.push(bullet);

    bullet = new Sprite({texture: playerBulletTex});
    bullet.transform.setPosition(this.gameObject.transform.getPosition().x + 20, this.gameObject.transform.getPosition().y + 15);
    bullet.transform.setScale(0.5);
    bullet.transform.setRotation(MathHelper.PIo2);

    this.bullets.push(bullet);
};