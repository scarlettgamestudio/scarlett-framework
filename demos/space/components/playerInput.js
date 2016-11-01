var script = sc.addScript("playerInput");

script.properties.add("strengthVertical", {
        default: 0.22
    }
);

script.properties.add("strengthHorizontal", {
        default: 0.48
    }
);

script.properties.add("falloff", {
        default: 0.15
    }
);

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

    this.gameObject.transform.translate(
        this.strengthHorizontal * directionHorizontal * delta,
        this.strengthVertical * directionVertical * delta);

    if (directionVertical == 0 && this.gameObject.transform.getPosition().y < 300) {
        this.gameObject.transform.translate(0, this.falloff * delta);

        if (this.gameObject.transform.getPosition().y > 300) {
            this.gameObject.transform.setPosition(this.gameObject.transform.getPosition().x, 300);
        }
    }
};