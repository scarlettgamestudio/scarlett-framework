AttributeDictionary.addRule("transform", "gameObject", {visible: false});

/**
 * Transform class
 */
class Transform {

    //#region Constructors

    /**
     * @param params
     */
    constructor(params) {
        params = params || {};

        // public properties:
        this.gameObject = params.gameObject || null;

        // private properties:
        this._position = params.position || new Vector2();
        this._rotation = params.rotation || 0.0;
        this._scale = params.scale || new Vector2(1.0, 1.0);

        this._overridePositionFunction = null;
        this._overrideRotationFunction = null;
        this._overrideScaleFunction = null;
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    /**
     *
     * @param data
     * @returns {Transform}
     */
    static restore(data) {
        return new Transform({
            position: Vector2.restore(data.position),
            rotation: data.rotation,
            scale: Vector2.restore(data.scale)
        });
    };

    //#endregion

    /**
     *
     */
    clearPositionGetter() {
        this._overridePositionFunction = null;
    };

    /**
     *
     */
    clearRotationGetter() {
        this._overrideRotationFunction = null;
    };

    /**
     *
     */
    clearScaleGetter() {
        this._overrideScaleFunction = null;
    };

    /**
     *
     * @param overrideFunction
     */
    overridePositionGetter(overrideFunction) {
        this._overridePositionFunction = overrideFunction;
    };

    /**
     *
     * @param overrideFunction
     */
    overrideScaleGetter(overrideFunction) {
        this._overrideScaleFunction = overrideFunction;
    };

    /**
     *
     * @param overrideFunction
     */
    overrideRotationGetter(overrideFunction) {
        this._overrideRotationFunction = overrideFunction;
    };

    /**
     *
     * @param position
     */
    lookAt(position) {
        let direction = this.getPosition().subtract(position).normalize();
        this.setRotation(Math.atan2(direction.y, direction.x));
    };

    /**
     *
     * @param x
     * @param y
     */
    setPosition(x, y) {
        this._position.set(x, y);
        this.gameObject.propagatePropertyUpdate("Position", this._position);
    };

    /**
     *
     * @returns {*}
     */
    getPosition() {
        if (isFunction(this._overridePositionFunction)) {
            return this._overridePositionFunction();
        }

        return this._position;
    };

    /**
     *
     * @param x
     * @param y
     */
    translate(x, y) {
        let curPos = this.getPosition();
        this.setPosition(curPos.x + (x || 0), curPos.y + (y || 0));
    };

    /**
     *
     * @param value
     */
    rotate(value) {
        this.setRotation(this.getRotation() + (value || 0));
    };

    /**
     *
     * @param x
     * @param y
     */
    scale(x, y) {
        let curScale = this.getScale();
        this.setPosition(curScale.x + (x || 0), curScale.y + (y || 0));
    };

    /**
     *
     * @param value
     */
    setRotation(value) {
        this._rotation = value;
        this.gameObject.propagatePropertyUpdate("Rotation", this._rotation);
    };

    /**
     *
     * @returns {*}
     */
    getRotation() {
        if (isFunction(this._overrideRotationFunction)) {
            return this._overrideRotationFunction();
        }

        return this._rotation;
    };

    /**
     *
     * @param x
     * @param y
     */
    setScale(x, y) {
        this._scale.set(x, y || x);
        this.gameObject.propagatePropertyUpdate("Scale", this._scale);
    };

    /**
     *
     * @returns {*}
     */
    getScale() {
        if (isFunction(this._overrideScaleFunction)) {
            return this._overrideScaleFunction();
        }

        return this._scale;
    };

    /**
     *
     * @returns {Transform}
     */
    clone() {
        return Transform.restore(this.objectify());
    };

    /**
     *
     * @returns {{position: {x, y}, rotation: (*|number), scale: {x, y}}}
     */
    objectify() {
        return {
            position: this._position.objectify(),
            rotation: this._rotation,
            scale: this._scale.objectify()
        };
    };

    /**
     *
     */
    unload() {

    };

    //#endregion

}