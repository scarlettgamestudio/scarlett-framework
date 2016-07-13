/**
 * DebugExt class
 */
function DebugExt(params) {
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
DebugExt.prototype.setGridRender = function (enable) {
	this._renderGrid = enable;
};

/**
 *
 * @param value
 */
DebugExt.prototype.setGridSize = function (value) {
	this._gridSize = value;
};

/**
 *
 * @param color
 */
DebugExt.prototype.setGridColor = function (color) {
	this._gridColor = color;
};

/**
 *
 * @param delta
 */
DebugExt.prototype.render = function (delta) {
	// render a grid?
	if (this._renderGrid) {
		var screenResolution = this._game.getVirtualResolution();
		var howManyX = screenResolution.width / this._gridSize + 10;
		var howManyY = screenResolution.height / this._gridSize + 10;

		// horizontal shift
		for (var x = 0; x < howManyX; x++) {
			this._primitiveRender.drawLine(
				{x: x * this._gridSize - screenResolution.width / 2, y: screenResolution.height / 2},
				{x: x * this._gridSize - screenResolution.width / 2, y: -screenResolution.height / 2},
				1, this._gridColor);
		}

		// vertical shift
		for (var y = 0; y < howManyY; y++) {
			this._primitiveRender.drawLine(
				{x: screenResolution.width / 2, y: y * this._gridSize - screenResolution.height / 2},
				{x: -screenResolution.width / 2, y: y * this._gridSize - screenResolution.height / 2},
				1, this._gridColor);
		}
	}
};