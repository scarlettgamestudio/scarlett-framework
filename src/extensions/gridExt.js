/**
 * GridExt class
 */
function GridExt(params) {
	params = params || {};

	if (!params.game) {
		throw "cannot create debug extension without game parameter";
	}

	// public properties:

	// private properties:
	this._game = params.game || null;
	this._renderGrid = true;
	this._gridSize = 32;
	this._gridColor = Color.Red;
	this._primitiveRender = new PrimitiveRender(params.game); // maybe get a batch here?
}

/**
 *
 * @param enable
 */
GridExt.prototype.setGridRender = function (enable) {
	this._renderGrid = enable;
};

/**
 *
 * @param value
 */
GridExt.prototype.setGridSize = function (value) {
	this._gridSize = value;
};

/**
 *
 * @param color
 */
GridExt.prototype.setGridColor = function (color) {
	this._gridColor = color;
};

/**
 *
 * @param delta
 */
GridExt.prototype.render = function (delta) {
	// render a grid?
	if (this._renderGrid) {
	    // I have an idea that can be great here..
        // create a global event for whenever the camera properties change (aka, calculate matrix is called), and store
        // the following calculations on event:
		var screenResolution = this._game.getVirtualResolution();
		var offsetX = this._game.getActiveCamera().x * -1 + (this._game.getActiveCamera().x % this._gridSize);
		var offsetY = this._game.getActiveCamera().y * -1 + (this._game.getActiveCamera().y % this._gridSize);
        var zoom = this._game.getActiveCamera().zoom;
        var zoomDifX = (zoom > 1 ? (zoom * screenResolution.width) * 2.0 : 0);
        var zoomDifY = (zoom > 1 ? (zoom * screenResolution.height) * 2.0 : 0);
        var howManyX = (screenResolution.width + zoomDifX) / this._gridSize + 2;
        var howManyY = (screenResolution.height + zoomDifY) / this._gridSize + 2;
		var left = -(screenResolution.width + zoomDifX) / 2;
		var right = (screenResolution.width + zoomDifX) / 2;
		var top = -(screenResolution.height + zoomDifY) / 2;
		var bottom = (screenResolution.height + zoomDifY) / 2;

		// horizontal shift ||||||||
		for (var x = 0; x < howManyX; x++) {
			this._primitiveRender.drawLine(
				{x: x * this._gridSize + left - (left % this._gridSize) + offsetX, y: bottom + this._gridSize + offsetY},
				{x: x * this._gridSize + left - (left % this._gridSize) + offsetX, y: top - this._gridSize + offsetY},
				1, this._gridColor);
		}

		// vertical shift _ _ _ _ _
		for (var y = 0; y < howManyY; y++) {
			this._primitiveRender.drawLine(
				{x: right + this._gridSize + offsetX, y: y * this._gridSize + top - (top % this._gridSize) + offsetY},
				{x: left - this._gridSize + offsetX, y: y * this._gridSize + top - (top % this._gridSize) + offsetY},
				1, this._gridColor);
		}
	}
};