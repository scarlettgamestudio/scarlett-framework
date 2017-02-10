var script = sc.addScript("enemyAgent");
var ENEMY_SPEED = 260;

script.prototype.update = function (delta) {
    //this.gameObject.transform.lookAt(player.transform.getPosition());
    //this.gameObject.transform.translate(-260 * delta, -Math.sin(this.gameObject.transform.getRotation()) * 60 * delta);
    this.gameObject.transform.translate
        (-Math.cos(this.gameObject.transform.getRotation()) * ENEMY_SPEED * delta, -Math.sin(this.gameObject.transform.getRotation()) * ENEMY_SPEED * delta);




    //this.gameObject.transform.translate(0, 0);
};