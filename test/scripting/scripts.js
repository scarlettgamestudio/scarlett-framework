var script = sc.addScript("simpleMovement");

script.properties.add("amount", {
        displayName: "whatever",
        default: 0.1
    }
);

script.prototype.update = function(delta) {
    this.gameObject.transform.translate(this.amount * delta);
};

