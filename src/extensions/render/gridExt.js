/**
 * GridExt class
 */
function GridExt(params) {
    params = params || {};

    if (!params.game) {
        throw "cannot create debug extension without game parameter";
    }

    // public properties:
    this.enabled = true;

    // private properties:
    this._game = params.game || null;
    this._gridSize = params.gridSize || 32;
    this._gridColor = params.gridColor || Color.Red;
    this._originLines = true;
    this._zoomMultiplier = 2;
    this._primitiveRender = new PrimitiveRender(params.game); // maybe get a batch here?
}

/**
 *
 * @param enable
 */
GridExt.prototype.setOriginLines = function (enable) {
    this._originLines = enable;
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
 */
GridExt.prototype.getGridSize = function () {
    return this._gridSize;
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
    if (this.enabled) {
        // I have an idea that can be great here..
        // create a global event for whenever the camera properties change (aka, calculate matrix is called), and store
        // the following calculations on event:
        var zoom = this._game.getActiveCamera().zoom;
        var floorZoom = Math.floor(zoom);

        //var gridSize = floorZoom > 1 ? this._gridSize * floorZoom : this._gridSize;
        var gridSize = this._gridSize;
        for (var i = 0; i < floorZoom - 1; i++) {
            if (i % this._zoomMultiplier == 0) {
                gridSize *= 2;
            }
        }

        var upperGridSize = gridSize * 2;
        var screenResolution = this._game.getVirtualResolution();
        var offsetX = this._game.getActiveCamera().x - (this._game.getActiveCamera().x % gridSize);
        var offsetY = this._game.getActiveCamera().y - (this._game.getActiveCamera().y % gridSize);
        var zoomDifX = (zoom * screenResolution.width) * 2.0;
        var zoomDifY = (zoom * screenResolution.height) * 2.0;
        var howManyX = Math.floor((screenResolution.width + zoomDifX) / gridSize + 2);
        var howManyY = Math.floor((screenResolution.height + zoomDifY) / gridSize + 2);
        var alignedX = Math.floor(howManyX / 2.0) % 2 == 0;
        var alignedY = Math.floor(howManyY / 2.0) % 2 == 0;
        var left = -(screenResolution.width + zoomDifX) / 2;
        var right = (screenResolution.width + zoomDifX) / 2;
        var top = -(screenResolution.height + zoomDifY) / 2;
        var bottom = (screenResolution.height + zoomDifY) / 2;
        var dynColor = this._gridColor.clone();
        var color = null;

        if (zoom > 1) {
            dynColor.a = 1 - ((zoom % this._zoomMultiplier) / this._zoomMultiplier);
        }

        // horizontal shift ||||||||
        for (var x = 0; x < howManyX; x++) {
            color = this._gridColor;
            if (((x * gridSize) + offsetX + (alignedX ? gridSize : 0)) % upperGridSize) {
                color = dynColor;
            }

            this._primitiveRender.drawLine(
                {
                    x: x * gridSize + left - (left % gridSize) + offsetX,
                    y: bottom + gridSize + offsetY
                },
                {
                    x: x * gridSize + left - (left % gridSize) + offsetX,
                    y: top - gridSize + offsetY
                },
                1, color);
        }

        // vertical shift _ _ _ _ _
        for (var y = 0; y < howManyY; y++) {
            color = this._gridColor;
            if (((y * gridSize) + offsetY + (alignedY ? gridSize : 0)) % upperGridSize) {
                color = dynColor;
            }

            this._primitiveRender.drawLine(
                {
                    x: right + this._gridSize + offsetX,
                    y: y * gridSize + top - (top % gridSize) + offsetY
                },
                {
                    x: left - gridSize + offsetX,
                    y: y * gridSize + top - (top % gridSize) + offsetY
                },
                1, color);
        }

        // main "lines" (origin)
        if (this._originLines ) {
            // vertical
            this._primitiveRender.drawRectangle(
                new Rectangle(-2, top - this._gridSize + offsetY, 4, screenResolution.height + zoomDifY),
                this._gridColor);

            // horizontal
            this._primitiveRender.drawRectangle(
                new Rectangle(left - this._gridSize + offsetX, -2, screenResolution.width + zoomDifX, 4),
                this._gridColor);
        }
    }
};