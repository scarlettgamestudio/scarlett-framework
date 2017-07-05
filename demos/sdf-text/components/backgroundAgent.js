var script = SC.addScript("backgroundAgent");

script.prototype.update = function(delta) {
  this.gameObject.transform.translate(-10 * delta, 0);
};
