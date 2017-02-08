/**
 * Created by Luis on 23/12/2016.
 */

/**
 * Stroke is a combination of a color and its size
 * @param {Color} color stroke color
 * @param {number} size size of the stroke
 * @constructor
 */
function Stroke(color, size) {
    // stroke color
    this._color = color || Color.fromRGBA(0.0, 0.0, 0.0, 1.0);
    // stroke size
    this._size = size || 0.0;
}

Stroke.prototype.getColor = function(){
    return this._color;
};

/**
 * Sets stroke's color
 * @param {Color|{r:number, g:number, b:number, a:number}} color
 */
Stroke.prototype.setColor = function(color){

    if (typeof color === Color){
        this._color = color;
        return;
    }

    if (color.r == null || color.g == null || color.b == null || color.a == null){
        throw new Error("The given stroke color is invalid");
    }

    this._color.set(color.r, color.g, color.b, color.a);
};

Stroke.prototype.setOpacity = function(alpha){

    var currentColor = this.getColor();

    this._color.set(currentColor.r, currentColor.g, currentColor.b, alpha);
};

Stroke.prototype.getOpacity = function(){
    return this.getColor().a;
};

Stroke.prototype.getSize = function(){
    return this._size;
};

Stroke.prototype.setSize = function(size){
    this._size = size;
};

Stroke.prototype.objectify = function () {
    return {
        color: this._color.objectify(),
        size: this.getSize()
    };
};

Stroke.prototype.restore = function (data) {
    return {
        color: this._color.restore(data),
        size: data.size
    };
};