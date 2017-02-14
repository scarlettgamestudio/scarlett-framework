var script = sc.addScript("simpleMovement");

script.properties.add("amount", {
        displayName: "whatever",
        default: 0.1
    }
);

script.prototype.update = function(delta) {
    this.gameObject.transform.translate(this.amount * delta);
};

var script = sc.addScript("simpleInput");

script.properties.add("strength", {
        default: 0.4
    }
);

script.prototype.update = function(delta) {
    var direction = 0;

    var keyboard = Keyboard.instance;

    if (keyboard.isKeyDown(Keys.RightArrow) || keyboard.isKeyDown(Keys.D)) {
        direction = 1;
    } else if (keyboard.isKeyDown(Keys.LeftArrow) || keyboard.isKeyDown(Keys.A)) {
        direction = -1;
    }

    this.gameObject.transform.translate(this.strength * direction * delta);
};