/**
 * Grid Extension Class
 */
class GridExt {

    //#region Constructors

    constructor(params) {
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
        this._primitiveBatch = new PrimitiveBatch(params.game);
        this._primitiveRender = new PrimitiveRender(params.game);
        this._useDynamicColor = params.dynamicColor || true;
    }

    //#endregion

    //#region Methods

    /**
     *
     * @param enable
     */
    setOriginLines(enable) {
        this._originLines = enable;
    }

    /**
     *
     * @param value
     */
    setGridSize(value) {
        this._gridSize = value;
    }

    /**
     *
     */
    getGridSize() {
        return this._gridSize;
    }

    /**
     *
     * @param color
     */
    setGridColor(color) {
        this._gridColor = color;
    }

    /**
     *
     * @param delta
     */
    render(delta) {
        // render a grid?
        if (this.enabled) {
            this._primitiveBatch.begin();

            // I have an idea that can be great here..
            // create a global event for whenever the camera properties change (aka, calculate matrix is called), and store
            // the following calculations on event:
            let zoom = this._game.getActiveCamera().zoom;
            let floorZoom = Math.floor(zoom);

            //var gridSize = floorZoom > 1 ? this._gridSize * floorZoom : this._gridSize;
            let gridSize = this._gridSize;
            for (let i = 0; i < floorZoom - 1; i++) {
                if (i % this._zoomMultiplier === 0) {
                    gridSize *= 2;
                }
            }

            let upperGridSize = gridSize * 2;
            let screenResolution = this._game.getVirtualResolution();
            let offsetX = this._game.getActiveCamera().x - (this._game.getActiveCamera().x % gridSize);
            let offsetY = this._game.getActiveCamera().y - (this._game.getActiveCamera().y % gridSize);
            let zoomDifX = (zoom * screenResolution.width) * 2.0;
            let zoomDifY = (zoom * screenResolution.height) * 2.0;
            let howManyX = Math.floor((screenResolution.width + zoomDifX) / gridSize + 2);
            let howManyY = Math.floor((screenResolution.height + zoomDifY) / gridSize + 2);
            let alignedX = Math.floor(howManyX / 2.0) % 2 === 0;
            let alignedY = Math.floor(howManyY / 2.0) % 2 === 0;
            let left = -(screenResolution.width + zoomDifX) / 2;
            let right = (screenResolution.width + zoomDifX) / 2;
            let top = -(screenResolution.height + zoomDifY) / 2;
            let bottom = (screenResolution.height + zoomDifY) / 2;
            let dynColor = this._gridColor.clone();
            let color = null;

            if (zoom > 1 && this._useDynamicColor) {
                dynColor.a = 1 - ((zoom % this._zoomMultiplier) / this._zoomMultiplier);
            }

            // horizontal shift ||||||||
            for (let x = 0; x < howManyX; x++) {
                color = this._gridColor;
                if (this._useDynamicColor && (((x * gridSize) + offsetX + (alignedX ? gridSize : 0)) % upperGridSize)) {
                    color = dynColor;
                }

                this._primitiveBatch.storeLine(
                    {
                        x: x * gridSize + left - (left % gridSize) + offsetX,
                        y: bottom + gridSize + offsetY
                    },
                    {
                        x: x * gridSize + left - (left % gridSize) + offsetX,
                        y: top - gridSize + offsetY
                    }, color);
            }

            // vertical shift _ _ _ _ _
            for (let y = 0; y < howManyY; y++) {
                color = this._gridColor;
                if (this._useDynamicColor && (((y * gridSize) + offsetY + (alignedY ? gridSize : 0)) % upperGridSize)) {
                    color = dynColor;
                }

                this._primitiveBatch.storeLine(
                    {
                        x: right + this._gridSize + offsetX,
                        y: y * gridSize + top - (top % gridSize) + offsetY
                    },
                    {
                        x: left - gridSize + offsetX,
                        y: y * gridSize + top - (top % gridSize) + offsetY
                    }, color);
            }

            this._primitiveBatch.flushLines();

            // main "lines" (origin)
            if (this._originLines) {
                // vertical
                this._primitiveRender.drawRectangle(
                    new Rectangle(-2, top - this._gridSize + offsetY, 4, screenResolution.height + zoomDifY),
                    this._gridColor
                );

                // horizontal
                this._primitiveRender.drawRectangle(
                    new Rectangle(left - this._gridSize + offsetX, -2, screenResolution.width + zoomDifX, 4),
                    this._gridColor
                );
            }
        }
    }

    //#endregion
}